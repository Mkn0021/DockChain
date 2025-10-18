import { ethers } from 'ethers';
import { BlockchainDocumentService } from '../services/document.service';
import { IssueDocumentParams } from '../validation/document';

describe('BlockchainDocumentService', () => {
    let documentService: BlockchainDocumentService;
    const mockAddress = '0x1234567890123456789012345678901234567890';
    const mockAbi = [] as ethers.InterfaceAbi;
    const mockDocHash = '0x' + '1'.repeat(64);

    beforeEach(() => {
        documentService = new BlockchainDocumentService(mockAddress, mockAbi);
    });

    describe('issueDocument', () => {
        it('should validate and issue a document successfully', async () => {
            const params: IssueDocumentParams = {
                docHash: mockDocHash,
                fields: {
                    name: "John Doe",
                    date: new Date("2025-10-19")
                },
                gasLimit: 500000
            };

            // Mock the contract calls
            const mockTxResponse = {
                hash: '0xtxhash',
                wait: jest.fn().mockResolvedValue({})
            };
            const mockContract = {
                issueDocument: jest.fn().mockResolvedValue(mockTxResponse)
            };

            // @ts-ignore - accessing private property for testing
            documentService.contract = mockContract as any;

            const result = await documentService.issueDocument(params);
            expect(result).toBe('0xtxhash');
            expect(mockContract.issueDocument).toHaveBeenCalled();
        });

        it('should throw error for invalid document hash', async () => {
            const params: IssueDocumentParams = {
                docHash: 'invalid-hash',
                fields: { name: "Test User" },
                gasLimit: 500000
            };

            await expect(documentService.issueDocument(params)).rejects.toThrow();
        });
    });

    describe('verifyDocument', () => {
        it('should verify a document successfully', async () => {
            const mockResult = [true, true, mockAddress, BigInt(1000)];
            const mockContract = {
                verifyDocument: jest.fn().mockResolvedValue(mockResult)
            };

            // @ts-ignore - accessing private property for testing
            documentService.contract = mockContract as any;

            const result = await documentService.verifyDocument(mockDocHash);
            expect(result).toEqual({
                exists: true,
                isValid: true,
                issuer: mockAddress,
                timestamp: BigInt(1000)
            });
        });
    });

    describe('getDocumentData', () => {
        it('should retrieve document data with dynamic fields', async () => {
            const mockResult = [
                mockDocHash,
                mockAddress,
                BigInt(1000),
                false,
                'field1Value',
                'field2Value'
            ];
            const mockContract = {
                getDocumentData: jest.fn().mockResolvedValue(mockResult)
            };

            // @ts-ignore - accessing private property for testing
            documentService.contract = mockContract as any;

            const result = await documentService.getDocumentData(mockDocHash);
            expect(result).toEqual({
                hash: mockDocHash,
                issuer: mockAddress,
                timestamp: BigInt(1000),
                revoked: false,
                field_1: 'field1Value',
                field_2: 'field2Value'
            });
        });
    });

    describe('generateDocHash', () => {
        it('should generate consistent document hash', () => {
            const fields = {
                name: 'John Doe',
                date: new Date('2025-10-19')
            };

            const hash = documentService.generateDocHash(fields);
            expect(hash).toMatch(/^0x[a-f0-9]{64}$/i);

            // Test consistency
            const hash2 = documentService.generateDocHash(fields);
            expect(hash).toBe(hash2);

            // Test order independence
            const fields2 = {
                date: new Date('2025-10-19'),
                name: 'John Doe'
            };
            const hash3 = documentService.generateDocHash(fields2);
            expect(hash).toBe(hash3);
        });
    });

    describe('batch operations', () => {
        it('should verify multiple documents in batch', async () => {
            const mockResult = [true, true, mockAddress, BigInt(1000)];
            const mockContract = {
                verifyDocument: jest.fn().mockResolvedValue(mockResult)
            };

            // @ts-ignore - accessing private property for testing
            documentService.contract = mockContract as any;

            const docHashes = [mockDocHash, mockDocHash];
            const results = await documentService.verifyDocumentsBatch(docHashes);

            expect(results).toHaveLength(2);
            results.forEach(result => {
                expect(result).toEqual({
                    exists: true,
                    isValid: true,
                    issuer: mockAddress,
                    timestamp: BigInt(1000)
                });
            });
        });
    });
});