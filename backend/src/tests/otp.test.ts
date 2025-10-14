import { OTPService } from "../services/otp.service";
import { MailService } from "../services/mail.service";
import { UserModel } from "../models/User.model";

// Mock dependencies
jest.mock("../services/mail.service");
jest.mock("../models/User.model");

const mockMailService = MailService as jest.Mocked<typeof MailService>;
const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;

describe("OTPService", () => {
    const mockEmail = "test@example.com";
    const mockOTP = "123456";
    const mockExpiry = new Date(Date.now() + 10 * 60 * 1000);

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock crypto to return predictable OTP
        jest.spyOn(require("crypto"), "randomInt").mockReturnValue(123456);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("generateOTP", () => {
        it("should generate 6-digit OTP", () => {
            const otp = OTPService.generateOTP();

            expect(otp).toBe("123456");
            expect(otp.length).toBe(6);
            expect(otp).toMatch(/^\d{6}$/);
        });
    });

    describe("getOTPExpiry", () => {
        it("should return expiry date 10 minutes from now", () => {
            const now = Date.now();
            jest.spyOn(Date, "now").mockReturnValue(now);

            const expiry = OTPService.getOTPExpiry();

            expect(expiry.getTime()).toBe(now + 10 * 60 * 1000);
        });
    });

    describe("sendOTP", () => {
        it("should generate OTP, save it, and send email", async () => {
            mockUserModel.findOneAndUpdate.mockResolvedValue({} as any);
            mockMailService.sendMail.mockResolvedValue();

            await OTPService.sendOTP(mockEmail);

            // Verify OTP was saved to database
            expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
                { email: mockEmail },
                {
                    otp: "123456",
                    otpExpiry: expect.any(Date)
                }
            );

            // Verify email was sent
            expect(mockMailService.sendMail).toHaveBeenCalledWith({
                to: mockEmail,
                subject: "Your OTP Code",
                text: "Your OTP code is 123456. It will expire in 10 minutes."
            });
        });

        it("should handle errors during OTP sending", async () => {
            mockUserModel.findOneAndUpdate.mockRejectedValue(new Error("DB error"));

            await expect(OTPService.sendOTP(mockEmail))
                .rejects.toThrow("DB error");
        });
    });

    describe("saveOTP", () => {
        it("should save OTP and expiry to user", async () => {
            mockUserModel.findOneAndUpdate.mockResolvedValue({} as any);

            await OTPService.saveOTP(mockEmail, mockOTP, mockExpiry);

            expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
                { email: mockEmail },
                {
                    otp: mockOTP,
                    otpExpiry: mockExpiry
                }
            );
        });
    });

    describe("verifyOTP", () => {
        it("should return true for valid OTP", async () => {
            const mockUser = {
                otp: mockOTP,
                otpExpiry: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes in future
            };
            mockUserModel.findOne.mockResolvedValue(mockUser as any);
            mockUserModel.findOneAndUpdate.mockResolvedValue({} as any);

            const isValid = await OTPService.verifyOTP(mockEmail, mockOTP);

            expect(isValid).toBe(true);
            expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: mockEmail });
            expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
                { email: mockEmail },
                { otp: null, otpExpiry: null }
            );
        });

        it("should return false when user not found", async () => {
            mockUserModel.findOne.mockResolvedValue(null);

            const isValid = await OTPService.verifyOTP(mockEmail, mockOTP);

            expect(isValid).toBe(false);
        });

        it("should return false when OTP is expired", async () => {
            const mockUser = {
                otp: mockOTP,
                otpExpiry: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes in past
            };
            mockUserModel.findOne.mockResolvedValue(mockUser as any);
            mockUserModel.findOneAndUpdate.mockResolvedValue({} as any);

            const isValid = await OTPService.verifyOTP(mockEmail, mockOTP);

            expect(isValid).toBe(false);
            expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
                { email: mockEmail },
                { otp: null, otpExpiry: null }
            );
        });

        it("should return false when OTP does not match", async () => {
            const mockUser = {
                otp: "654321", // Different OTP
                otpExpiry: new Date(Date.now() + 5 * 60 * 1000)
            };
            mockUserModel.findOne.mockResolvedValue(mockUser as any);

            const isValid = await OTPService.verifyOTP(mockEmail, mockOTP);

            expect(isValid).toBe(false);
        });

        it("should return false when OTP is missing", async () => {
            const mockUser = {
                otp: null,
                otpExpiry: new Date(Date.now() + 5 * 60 * 1000)
            };
            mockUserModel.findOne.mockResolvedValue(mockUser as any);

            const isValid = await OTPService.verifyOTP(mockEmail, mockOTP);

            expect(isValid).toBe(false);
        });

        it("should return false when expiry is missing", async () => {
            const mockUser = {
                otp: mockOTP,
                otpExpiry: null
            };
            mockUserModel.findOne.mockResolvedValue(mockUser as any);

            const isValid = await OTPService.verifyOTP(mockEmail, mockOTP);

            expect(isValid).toBe(false);
        });
    });

    describe("clearOTP", () => {
        it("should clear OTP and expiry from user", async () => {
            mockUserModel.findOneAndUpdate.mockResolvedValue({} as any);

            await OTPService.clearOTP(mockEmail);

            expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
                { email: mockEmail },
                { otp: null, otpExpiry: null }
            );
        });
    });

    describe("resendOTP", () => {
        it("should generate new OTP and save it", async () => {
            mockUserModel.findOneAndUpdate.mockResolvedValue({} as any);

            const newOTP = await OTPService.resendOTP(mockEmail);

            expect(newOTP).toBe("123456");
            expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
                { email: mockEmail },
                {
                    otp: "123456",
                    otpExpiry: expect.any(Date)
                }
            );
        });
    });
});