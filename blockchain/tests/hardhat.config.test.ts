import { getHardhatProvider, getHardhatWallet, HARDHAT_CONFIG } from '../config/hardhat';

async function test() {
    console.log("Testing Hardhat Config...");

    // 1. Check provider
    const provider = await getHardhatProvider();
    const blockNumber = await provider.getBlockNumber();
    console.log("Connected to Hardhat network. Current block:", blockNumber);

    // 2. Check wallet
    const wallet = await getHardhatWallet();
    const balance = await provider.getBalance(wallet.address);
    console.log(`Wallet address: ${wallet.address}`);
    console.log(`Wallet balance: ${balance.toString()} wei`);
    console.log(`Wallet balance: ${Number(balance) / 1e18} ETH`);

    // 3. Check config values
    console.log("HARDHAT_CONFIG:", HARDHAT_CONFIG);
}

test().catch(err => {
    console.error("Test failed:", err);
});

