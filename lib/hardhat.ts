import { ethers, JsonRpcProvider, Wallet } from 'ethers';
import { APIError } from './api/errors';

const HARDHAT_CONFIG = {
    url: process.env.HARDHAT_URL || 'http://127.0.0.1:8545',
    chainId: 31337,
    defaultPrivateKey: process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
} as const;

export function getHardhatProvider(): JsonRpcProvider {
    try {
        return new JsonRpcProvider(HARDHAT_CONFIG.url);
    } catch (error) {
        throw APIError.internal(`Failed to connect to Hardhat network: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export function getHardhatWallet(privateKey?: string): Wallet {
    try {
        const key = privateKey || HARDHAT_CONFIG.defaultPrivateKey;

        const provider = getHardhatProvider();
        return new ethers.Wallet(key, provider);
    } catch (error) {
        throw APIError.internal(`Failed to create Hardhat wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
