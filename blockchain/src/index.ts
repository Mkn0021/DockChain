// Core Services
export { ContractCompiler } from './compiler';
export { ContractDeployer } from './deployer';
export { BlockchainDocumentService } from './services/document.service';

// Document Types and Validation
export type {
    DocumentField,
    DocumentDataResult,
    DocumentVerificationResult,
    IssueDocumentParams,
    TemplateInfo
} from './validation/document';

// Compiler Types
export type {
    CompilationResult,
    SolcOutput,
    SolcError
} from './validation/compiler';

// Contract Generation Types
export type {
    ContractCompileInput
} from './validation/compiler';

// Deployment Types
export type {
    DeploymentConfig,
    ContractConfig
} from './validation/deployer';

// Validation Schemas
export { ContractCompileSchema } from './validation/compiler';
export { IssueDocumentParamsSchema } from './validation/document';
export { DeploymentConfigSchema, ContractConfigSchema, abiValidation } from './validation/deployer';