import * as solc from 'solc';
import type { CompilationResult, SolcOutput } from '@/types/blockchain';
import { APIError } from '../api/errors';

export class ContractCompiler {
    static generateContractSource(
        templateName: string,
        allFields: string[],
        requiredFields: string[]
    ): string {
        const contractName = templateName.replace(/[^a-zA-Z0-9]/g, '') + 'Document';

        const validationCode = requiredFields.map(field =>
            `require(bytes(_${field}).length > 0, "${field} is required");`
        ).join('\n        ');

        const allFieldsCode = allFields.map(field => `string ${field};`).join('\n        ');
        const parameterCode = allFields.map(field => `string memory _${field}`).join(',\n        ');
        const assignmentCode = allFields.map(field => `${field}: _${field}`).join(',\n            ');
        const getterReturnTypes = allFields.map(field => `string memory ${field}`).join(',\n        ');
        const getterReturnValues = allFields.map(field => `doc.${field}`).join(',\n            ');

        return `
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.19;

    contract ${contractName} {
        struct DocumentData {
            bytes32 hash;
            address issuer;
            uint256 timestamp;
            bool revoked;
            ${allFieldsCode}
        }

        mapping(bytes32 => DocumentData) public documents;
        mapping(address => bool) public authorizedIssuers;
        address public owner;
        string public constant TEMPLATE_TYPE = "${templateName}";
        uint256 public documentCount;

        event DocumentIssued(
            bytes32 indexed docHash, 
            address indexed issuer,
            uint256 timestamp
        );
        event DocumentRevoked(bytes32 indexed docHash, address indexed revoker);
        event IssuerAuthorized(address indexed issuer, address indexed authorizer);
        event IssuerRevoked(address indexed issuer, address indexed revoker);

        modifier onlyAuthorized() {
            require(authorizedIssuers[msg.sender], "Not authorized issuer");
            _;
        }

        modifier onlyOwner() {
            require(msg.sender == owner, "Only owner allowed");
            _;
        }

        modifier onlyOwnerOrIssuer(bytes32 _docHash) {
            require(
                msg.sender == owner || documents[_docHash].issuer == msg.sender,
                "Not authorized for this document"
            );
            _;
        }

        constructor() {
            owner = msg.sender;
            authorizedIssuers[msg.sender] = true;
            emit IssuerAuthorized(msg.sender, msg.sender);
        }

        function addAuthorizedIssuer(address _issuer) external onlyOwner {
            require(_issuer != address(0), "Invalid issuer address");
            require(!authorizedIssuers[_issuer], "Already authorized");

            authorizedIssuers[_issuer] = true;
            emit IssuerAuthorized(_issuer, msg.sender);
        }

        function revokeIssuer(address _issuer) external onlyOwner {
            require(_issuer != owner, "Cannot revoke owner");
            require(authorizedIssuers[_issuer], "Not an authorized issuer");

            authorizedIssuers[_issuer] = false;
            emit IssuerRevoked(_issuer, msg.sender);
        }

        function issueDocument(
            bytes32 _docHash,
            ${parameterCode}
        ) external onlyAuthorized {
            require(_docHash != bytes32(0), "Invalid document hash");
            require(documents[_docHash].timestamp == 0, "Document already exists");

            ${validationCode}

            documents[_docHash] = DocumentData({
                hash: _docHash,
                issuer: msg.sender,
                timestamp: block.timestamp,
                revoked: false,
                ${assignmentCode}
            });

            documentCount++;
            emit DocumentIssued(_docHash, msg.sender, block.timestamp);
        }

        function verifyDocument(bytes32 _docHash) external view returns (
            bool exists,
            bool isValid,
            address issuer,
            uint256 timestamp
        ) {
            DocumentData storage doc = documents[_docHash];
            bool docExists = doc.timestamp != 0;
            bool valid = docExists && !doc.revoked;

            return (docExists, valid, doc.issuer, doc.timestamp);
        }

        function getDocumentData(bytes32 _docHash) external view returns (
            ${getterReturnTypes}
        ) {
            DocumentData storage doc = documents[_docHash];
            require(doc.timestamp != 0, "Document does not exist");

            return (
                ${getterReturnValues}
            );
        }

        function revokeDocument(bytes32 _docHash) external onlyOwnerOrIssuer(_docHash) {
            require(documents[_docHash].timestamp != 0, "Document does not exist");
            require(!documents[_docHash].revoked, "Document already revoked");

            documents[_docHash].revoked = true;
            emit DocumentRevoked(_docHash, msg.sender);
        }

        function getTemplateInfo() external view returns (
            string memory templateType,
            address contractOwner,
            uint256 totalDocuments
        ) {
            return (TEMPLATE_TYPE, owner, documentCount);
        }
    }`;
    }


    static compile(contractSource: string): CompilationResult {
        const inputForSolc = {
            language: 'Solidity',
            sources: {
                'Contract.sol': {
                    content: contractSource,
                },
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['abi', 'evm.bytecode'],
                    },
                },
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            },
        };

        const output: SolcOutput = JSON.parse(solc.compile(JSON.stringify(inputForSolc)));

        if (output.errors) {
            const errors = output.errors.filter(error => error.severity === 'error');
            if (errors.length > 0) {
                throw new APIError(`Compilation failed: ${errors.map(e => e.message).join(', ')}`);
            }
        }

        const contractName = Object.keys(output.contracts['Contract.sol'])[0];
        const contract = output.contracts['Contract.sol'][contractName];

        return {
            abi: contract.abi,
            bytecode: contract.evm.bytecode.object,
            contractName
        };
    }
}
