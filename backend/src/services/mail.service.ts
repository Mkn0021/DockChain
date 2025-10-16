import nodemailer from "nodemailer";
import { env } from "@config/env";
import { SendMailSchema, SendMailData } from "@type/mail.type";
import APIError from "@api/errors";

export class MailService {
    private static getTransporter() {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: env.EMAIL_USER,
                pass: env.EMAIL_PASS,
            },
        });
    }

    static async sendMail(sendMailData: SendMailData): Promise<void> {
        const validationResult = SendMailSchema.safeParse(sendMailData);

        if (!validationResult.success) {
            const errorMessage = validationResult.error.issues[0]?.message;
            throw APIError.badRequest(`Invalid email parameters: ${errorMessage}`);
        }

        const { to, subject, text } = validationResult.data;

        const mailOptions = {
            from: env.EMAIL_USER,
            to,
            subject: subject.trim(),
            text: text.trim()
        };

        const transporter = this.getTransporter();
        await transporter.sendMail(mailOptions);
    }
}