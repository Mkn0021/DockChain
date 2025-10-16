import crypto from "crypto";
import UserModel from "@model/User.model";
import { MailService } from "@services/mail.service";

export class OTPService {
    private static readonly OTP_EXPIRY_MINUTES = 10;

    static generateOTP(): string {
        return crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    }

    static getOTPExpiry(): Date {
        return new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);
    }

    static async sendOTP(email: string): Promise<void> {
        const otp = this.generateOTP();
        const expiry = this.getOTPExpiry();

        await this.saveOTP(email, otp, expiry);
        await MailService.sendMail({
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}. It will expire in ${this.OTP_EXPIRY_MINUTES} minutes.`
        });
    }

    static async saveOTP(email: string, otp: string, expiry: Date): Promise<void> {
        await UserModel.findOneAndUpdate(
            { email },
            {
                otp,
                otpExpiry: expiry
            }
        );
    }

    static async verifyOTP(email: string, userProvidedOTP: string): Promise<boolean> {
        const user = await UserModel.findOne({ email });

        if (!user || !user.otp || !user.otpExpiry) {
            return false;
        }

        if (user.otpExpiry < new Date()) {
            await this.clearOTP(email);
            return false;
        }

        if (user.otp !== userProvidedOTP) {
            return false;
        }

        await this.clearOTP(email);
        return true;
    }

    static async clearOTP(email: string): Promise<void> {
        await UserModel.findOneAndUpdate(
            { email },
            {
                otp: null,
                otpExpiry: null
            }
        );
    }

    static async resendOTP(email: string): Promise<string> {
        const otp = this.generateOTP();
        const expiry = this.getOTPExpiry();

        await this.saveOTP(email, otp, expiry);
        return otp;
    }
}