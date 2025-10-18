import { ethers } from 'ethers';
import { getHardhatProvider, getHardhatWallet } from '../config/hardhat';
import {
    IssueDocumentParamsSchema, DocumentDataResult,
    DocumentVerificationResult, IssueDocumentParams, TemplateInfo
} from '../validation/document';


export class BlockchainDocumentService {
    private contractAddress: string;
    private abi: ethers.InterfaceAbi;
    private contract: ethers.Contract;

    constructor(contractAddress: string, abi: ethers.InterfaceAbi) {
        this.contractAddress = contractAddress;
        this.abi = abi;
        this.contract = null as unknown as ethers.Contract;
    }

    private async initializeContract(readOnly: boolean = false): Promise<ethers.Contract> {
        if (this.contract) return this.contract;

        if (readOnly) {
            const provider = await getHardhatProvider();
            this.contract = new ethers.Contract(this.contractAddress, this.abi, provider);
        } else {
            const wallet = await getHardhatWallet();
            this.contract = new ethers.Contract(this.contractAddress, this.abi, wallet);
        }

        return this.contract;
    }
    async issueDocument(params: IssueDocumentParams, gasLimit: number = 500000): Promise<string> {
        try {
            const validatedParams = IssueDocumentParamsSchema.parse(params);
            const contract = await this.initializeContract(false);

            const txResponse = await contract.issueDocument(
                validatedParams.docHash,
                ...Object.values(validatedParams.fields),
                { gasLimit: validatedParams.gasLimit || gasLimit }
            );

            const receipt = await txResponse.wait();
            if (!receipt) throw new Error('Transaction failed');

            return txResponse.hash;
        } catch (error) {
            throw new Error(`Document issuance failed: ${(error as Error).message}`);
        }
    }

    async verifyDocument(docHash: string): Promise<DocumentVerificationResult> {
        try {
            const contract = await this.initializeContract(true);
            const result = await contract.verifyDocument(docHash);

            return {
                exists: result[0],
                isValid: result[1],
                issuer: result[2],
                timestamp: result[3]
            };
        } catch (error) {
            throw new Error(`Document verification failed: ${(error as Error).message}`);
        }
    }

    async getDocumentData(docHash: string): Promise<DocumentDataResult> {
        try {
            const contract = await this.initializeContract(true);
            const result = await contract.getDocumentData(docHash);

            const baseData = {
                hash: result[0],
                issuer: result[1],
                timestamp: result[2],
                revoked: result[3]
            };

            const dynamicFields: Record<string, any> = {};
            for (let i = 4; i < result.length; i++) {
                dynamicFields[`field_${i - 3}`] = result[i];
            }

            return { ...baseData, ...dynamicFields };
        } catch (error) {
            throw new Error(`Failed to get document data: ${(error as Error).message}`);
        }
    }

    async revokeDocument(docHash: string): Promise<string> {
        try {
            const contract = await this.initializeContract(false);
            const txResponse = await contract.revokeDocument(docHash);
            await txResponse.wait();

            return txResponse.hash;
        } catch (error) {
            throw new Error(`Document revocation failed: ${(error as Error).message}`);
        }
    }

    async addAuthorizedIssuer(issuerAddress: string): Promise<string> {
        try {
            const contract = await this.initializeContract(false);
            const txResponse = await contract.addAuthorizedIssuer(issuerAddress);
            await txResponse.wait();

            return txResponse.hash;
        } catch (error) {
            throw new Error(`Failed to add authorized issuer: ${(error as Error).message}`);
        }
    }

    async revokeIssuer(issuerAddress: string): Promise<string> {
        try {
            const contract = await this.initializeContract(false);
            const txResponse = await contract.revokeIssuer(issuerAddress);
            await txResponse.wait();

            return txResponse.hash;
        } catch (error) {
            throw new Error(`Failed to revoke issuer: ${(error as Error).message}`);
        }
    }

    async isAuthorizedIssuer(address: string): Promise<boolean> {
        try {
            const contract = await this.initializeContract(true);
            return await contract.authorizedIssuers(address);
        } catch (error) {
            throw new Error(`Failed to check issuer authorization: ${(error as Error).message}`);
        }
    }

    async getTemplateInfo(): Promise<TemplateInfo> {
        try {
            const contract = await this.initializeContract(true);
            const result = await contract.getTemplateInfo();

            return {
                templateType: result[0],
                contractOwner: result[1],
                totalDocuments: result[2]
            };
        } catch (error) {
            throw new Error(`Failed to get template info: ${(error as Error).message}`);
        }
    }

    async getDocumentCount(): Promise<bigint> {
        try {
            const contract = await this.initializeContract(true);
            return await contract.documentCount();
        } catch (error) {
            throw new Error(`Failed to get document count: ${(error as Error).message}`);
        }
    }

    async getOwner(): Promise<string> {
        try {
            const contract = await this.initializeContract(true);
            return await contract.owner();
        } catch (error) {
            throw new Error(`Failed to get contract owner: ${(error as Error).message}`);
        }
    }

    generateDocHash(fields: Record<string, any>): string {
        const concatenatedFields = Object.values(fields)
            .sort()
            .map(field => String(field))
            .join('|');
        return ethers.keccak256(ethers.toUtf8Bytes(concatenatedFields));
    }

    async verifyDocumentsBatch(docHashes: string[]): Promise<DocumentVerificationResult[]> {
        const results: DocumentVerificationResult[] = [];

        for (const docHash of docHashes) {
            try {
                const result = await this.verifyDocument(docHash);
                results.push(result);
            } catch (error) {
                console.error(`Failed to verify document ${docHash}:`, error);
                results.push({
                    exists: false,
                    isValid: false,
                    issuer: ethers.ZeroAddress,
                    timestamp: BigInt(0)
                });
            }
        }

        return results;
    }
}