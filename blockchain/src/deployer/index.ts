import { ethers } from "ethers";
import { getHardhatWallet, getHardhatProvider } from '../config/hardhat';
import { DeploymentConfig, DeploymentConfigSchema, ContractConfig, ContractConfigSchema } from '../validation/deployer';


export class ContractDeployer {
    static async deploy(config: DeploymentConfig): Promise<string> {
        const validatedConfig = DeploymentConfigSchema.parse(config);
        const { abi, bytecode } = validatedConfig;

        try {
            const wallet = await getHardhatWallet();
            const factory = new ethers.ContractFactory(abi, bytecode, wallet);
            const contract = await factory.deploy();
            const contractAddress = await contract.waitForDeployment().then(c => c.getAddress());

            return contractAddress;
        } catch (error) {
            throw Error('Contract deployment failed: ' + (error as Error).message);
        }
    }

    static async verifyDeployment(address: string): Promise<boolean> {
        try {
            const provider = await getHardhatProvider();
            const code = await provider.getCode(address);
            return code !== null && code !== '0x' && code !== '0x0';
        } catch {
            return false;
        }
    }

    static async getContract(config: ContractConfig): Promise<ethers.Contract> {
        const validatedConfig = ContractConfigSchema.parse(config);
        const { contractAddress, abi, readOnly = false } = validatedConfig;

        if (readOnly) {
            const provider = await getHardhatProvider();
            return new ethers.Contract(contractAddress, abi, provider);
        } else {
            const wallet = await getHardhatWallet();
            return new ethers.Contract(contractAddress, abi, wallet);
        }
    }
}