import { ContractParts } from "./types";

export function generateContract(contractData: ContractParts): string {
    return `
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.19;

    contract ${contractData.templateName.replace(/[^a-zA-Z0-9]/g, '') + 'Document'} {
        struct DocumentData {
            bytes32 hash;
            address issuer;
            uint256 timestamp;
            bool revoked;
            ${contractData.allFieldsCode}
        }

        mapping(bytes32 => DocumentData) public documents;
        mapping(address => bool) public authorizedIssuers;
        address public owner;
        string public constant TEMPLATE_TYPE = "${contractData.templateName}";
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
            ${contractData.parameterCode}
        ) external onlyAuthorized {
            require(_docHash != bytes32(0), "Invalid document hash");
            require(documents[_docHash].timestamp == 0, "Document already exists");

            ${contractData.validationCode}

            documents[_docHash] = DocumentData({
                hash: _docHash,
                issuer: msg.sender,
                timestamp: block.timestamp,
                revoked: false,
                ${contractData.assignmentCode}
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
            ${contractData.getterReturnTypes}
        ) {
            DocumentData storage doc = documents[_docHash];
            require(doc.timestamp != 0, "Document does not exist");

            return (
                ${contractData.getterReturnValues}
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
    }`
};