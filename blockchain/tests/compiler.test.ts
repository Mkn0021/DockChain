import { ContractCompiler } from '../compiler';

async function testContractCompiler() {
    try {
        const template = {
            templateName: "TestTemplate",
            allFields: ["name", "email", "id"],
            requiredFields: ["name", "id"]
        };

        // Generate Solidity source code
        const source = ContractCompiler.generateContractSource(template);
        console.log("Generated Solidity code:\n", source);

        // Compile the generated contract
        const compiled = ContractCompiler.compile(source);
        console.log("Compiled contract info:");
        console.log("Contract Name:", compiled.contractName);
        console.log("ABI:", compiled.abi);
        console.log("Bytecode (first 60 chars):", compiled.bytecode.slice(0, 60), "...");

        console.log("✅ ContractCompiler test passed.");
    } catch (err) {
        console.error("❌ ContractCompiler test failed:", err);
    }
}

testContractCompiler();
