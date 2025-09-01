
import { ethers } from "ethers";
import type { IssueDocumentResult, VerifyDocumentResult } from '@/types/blockchain';
import { getHardhatWallet, getHardhatProvider } from './config';
import { InterfaceAbi } from "ethers";
import { ContractTransactionResponse } from "ethers";
import { APIError } from "../api/errors";



export class ContractDeployer {
    static async deploy(abi: InterfaceAbi, bytecode: string): Promise<string> {
        try {
            const wallet = getHardhatWallet();
            const factory = new ethers.ContractFactory(abi, bytecode, wallet);
            const contract = await factory.deploy();
            const contractAddress = await contract.waitForDeployment().then(c => c.getAddress());

            return contractAddress;
        } catch (error) {
            throw APIError.internal('Contract deployment failed: ' + (error as Error).message);
        }
    }

    static async issueDocument(
        contractAddress: string,
        abi: InterfaceAbi,
        fields: Record<string, string>,
        gasLimit: number = 500000
    ): Promise<IssueDocumentResult> {
        try {
            const wallet = getHardhatWallet();
            const contract = new ethers.Contract(contractAddress, abi, wallet);

            // Generate docHash from field values
            const concatenatedFields = Object.values(fields).join('|');
            const docHash = ethers.keccak256(ethers.toUtf8Bytes(concatenatedFields));

            const args = [docHash, ...Object.values(fields)];
            const txResponse: ContractTransactionResponse = await contract.issueDocument(...args, { gasLimit });
            await txResponse.wait();

            return {
                docHash,
                transactionHash: txResponse.hash,
            };
        } catch (error) {
            throw APIError.internal('Document issuance failed: ' + (error as Error).message);
        }
    }

    static async verifyDocument(
        contractAddress: string,
        abi: InterfaceAbi,
        fields: Record<string, string>,
    ): Promise<VerifyDocumentResult> {
        try {
            const provider = getHardhatProvider();
            const contract = new ethers.Contract(contractAddress, abi, provider);

            // Generate the same docHash as used when issuing
            const concatenatedFields = Object.values(fields).join('|');
            const docHash = ethers.keccak256(ethers.toUtf8Bytes(concatenatedFields));

            const result: Omit<VerifyDocumentResult, 'docHash'> = await contract.verifyDocument(docHash);

            return { docHash, ...result };
        } catch (error) {
            throw APIError.internal('Document verification failed: ' + (error as Error).message);
        }
    }

    static async verifyDeployment(address: string): Promise<boolean> {
        try {
            const provider = getHardhatProvider();
            const code = await provider.getCode(address);
            return code !== null && code !== '0x' && code !== '0x0';
        } catch {
            APIError.internal('Contract verification failed');
            return false;
        }
    }
}