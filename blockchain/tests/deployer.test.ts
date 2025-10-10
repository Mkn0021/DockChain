import { ContractCompiler } from "../compiler";
import { ContractDeployer } from "../deployer";

// npx ts-node tests/deployer.test.ts

async function testDeployer() {
    console.log("=== Testing ContractDeployer ===");

    // 1. Generate a simple contract
    const source = ContractCompiler.generateContractSource({
        templateName: 'TestTemplate',
        allFields: ['name', 'email'],
        requiredFields: ['name']
    });
    const compiled = ContractCompiler.compile(source);

    console.log("Compiled contract ABI:", compiled.abi);
    console.log("Compiled contract bytecode length:", compiled.bytecode.length);

    // 2. Deploy the contract
    const contractAddress = await ContractDeployer.deploy({
        abi: compiled.abi,
        bytecode: compiled.bytecode.startsWith('0x')
            ? compiled.bytecode
            : '0x' + compiled.bytecode
    });
    console.log("Contract deployed at:", contractAddress);

    // 3. Verify deployment
    const isDeployed = await ContractDeployer.verifyDeployment(contractAddress);
    console.log("Contract verified:", isDeployed);

    // 4. Get contract instance (read/write)
    const contract = await ContractDeployer.getContract({
        contractAddress,
        abi: compiled.abi
    });
    console.log("Contract instance ready at:", contract.target);

    console.log("=== ContractDeployer test finished ===");
}

testDeployer().catch(err => {
    console.error("Test failed:", err);
});
