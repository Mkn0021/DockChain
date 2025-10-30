import APIError from "@api/errors";
import { OTPService } from "@services/otp.service";
import { JWTService } from "@services/jwt.service";
import { OAuthManager } from "@utils/oauth.util";
import UserModel, { IUser } from "@model/User.model";
import { RegisterData, VerifyEmailData, LoginData, ResetPasswordData } from "@type/auth.type";

class AuthService {
    async register(data: RegisterData) {
        const existingUser = await UserModel.findOne({ email: data.email });
        if (existingUser) throw APIError.badRequest("Email already in use");

        const newUser: IUser = await UserModel.create({
            name: data.name,
            email: data.email,
            password: data.password,
            isVerified: false
        });

        await OTPService.sendOTP(data.email); // TODO: offload to queue

        return {
            userData: newUser.toJSON(),
            message: "Registration successful. Please verify your email."
        };

    }

    async login(data: LoginData) {
        const user: IUser | null = await UserModel.findOne({ email: data.email });
        if (!user) throw APIError.notFound("User not found");
        if (!user.isVerified) throw APIError.forbidden("Email not verified");

        const isPasswordValid = await user.isPasswordCorrect(data.password);
        if (!isPasswordValid) throw APIError.unauthorized("Invalid credentials");

        const { accessToken, refreshToken } = await JWTService.generateAuthTokens(
            user._id.toString(),
            {
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        );

        const cookies = JWTService.generateCookies({ accessToken, refreshToken });

        return {
            cookies,
            userData: {
                ...user.toJSON(),
                accessToken,
                refreshToken
            },
            message: "Login successful"
        };

    }

    async refresh(token: string) {
        const decoded = JWTService.verifyRefreshToken(token);
        const userId = decoded.userId;

        const isValid = await JWTService.isValidRefreshToken(userId, token);
        if (!isValid) throw APIError.unauthorized("Invalid refresh token");

        const user = await UserModel.findById(userId);
        if (!user) throw APIError.notFound("User not found");

        const { accessToken, refreshToken } = await JWTService.generateAuthTokens(
            userId,
            {
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        );

        const cookies = [JWTService.refreshCookie(accessToken)];

        return {
            cookies,
            tokens: { accessToken, refreshToken },
            message: "Tokens refreshed successfully"
        };
    }

    async logout(userId: string) {
        await JWTService.revokeRefreshToken(userId);
        const cookies = JWTService.clearCookies();

        return {
            cookies,
            message: "Logged out successfully"
        };
    }

    async forgotPassword(email: string) {
        const user = await UserModel.findOne({ email });
        if (!user) throw APIError.notFound("User not found");

        await OTPService.sendOTP(email);
        return { message: "Password reset OTP sent to your email" };
    }

    async resetPassword(data: ResetPasswordData) {
        const user = await UserModel.findOne({ email: data.email });
        if (!user) throw APIError.notFound("User not found");

        const isOTPValid = await OTPService.verifyOTP(data.email, data.otp);
        if (!isOTPValid) throw APIError.badRequest("Invalid or expired OTP");

        user.password = data.newPassword;
        await user.save();

        await JWTService.revokeRefreshToken(user._id.toString());

        return { message: "Password reset successful" };
    }

    async verifyEmail(data: VerifyEmailData): Promise<boolean> {
        const user = await UserModel.findOne({ email: data.email });
        if (!user) throw APIError.notFound("User not found");

        const isValid = await OTPService.verifyOTP(data.email, data.otp);
        if (!isValid) throw APIError.badRequest("Invalid or expired OTP");

        if (user.isVerified) return true;

        user.isVerified = true;
        await user.save();

        return true;
    }

    // Google OAuth Methods
    async loginWithGoogle(code: string) {
        const profile = await OAuthManager.handleCallback('google', code);

        const googleUser = await UserModel.findOne({ googleId: profile.id });
        if (googleUser) {
            return await this.generateAuthResponse(googleUser);
        }

        const emailUser = await UserModel.findOne({ email: profile.email });
        if (emailUser) {
            emailUser.googleId = profile.id;
            await emailUser.save();
            return await this.generateAuthResponse(emailUser);
        }

        const newUser = await UserModel.create({
            name: profile.name,
            email: profile.email,
            googleId: profile.id,
            isVerified: true
        });

        return await this.generateAuthResponse(newUser);
    }

    async unlinkGoogle(userId: string) {
        await UserModel.findByIdAndUpdate(userId, {
            $unset: { googleId: 1 }
        });
        return { message: "Google account unlinked" };
    }

    private async generateAuthResponse(user: IUser) {
        const { accessToken, refreshToken } = await JWTService.generateAuthTokens(
            user._id.toString(),
            {
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        );

        return {
            userData: {
                ...user.toJSON(),
                accessToken,
                refreshToken
            },
            message: "Google login successful"
        };
    }
}

export const authService = new AuthService();
