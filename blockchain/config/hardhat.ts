import { ethers, JsonRpcProvider, Wallet } from 'ethers';
import { env } from '../validation/env';

export const HARDHAT_CONFIG = {
    url: env.HARDHAT_URL,
    chainId: 31337,
    defaultPrivateKey: env.HARDHAT_PRIVATE_KEY,
} as const;

export async function getHardhatProvider(): Promise<JsonRpcProvider> {
    try {
        const provider = new ethers.JsonRpcProvider(HARDHAT_CONFIG.url);
        await provider.getNetwork();
        return provider;
    } catch (err) {
        throw new Error(
  `Failed to connect to Hardhat network at ${HARDHAT_CONFIG.url}: ${
    err instanceof Error ? err.message : err
  }

    Make sure your local Hardhat node is running:
        1. Open a terminal
        2. Run: npx hardhat node
        3. Then retry this script
    `
    );
    }
}

export async function getHardhatWallet(privateKey?: string): Promise<Wallet> {
    const provider = await getHardhatProvider();
    const key = privateKey || HARDHAT_CONFIG.defaultPrivateKey;
    return new ethers.Wallet(key, provider);
}
