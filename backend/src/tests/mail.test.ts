import { MailService } from "@services/mail.service";
import { SendMailData } from "@type/mail.type";
import nodemailer from "nodemailer";

// Mock nodemailer
jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn()
  }))
}));

const mockCreateTransport = nodemailer.createTransport as jest.Mock;

describe("MailService", () => {
  let mockSendMail: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSendMail = jest.fn().mockResolvedValue({ messageId: "test123" });
    mockCreateTransport.mockReturnValue({ sendMail: mockSendMail });
  });

  describe("Validation", () => {
    it("should reject invalid email", async () => {
      const invalidData: SendMailData = {
        to: "invalid-email",
        subject: "Test Subject",
        text: "Test content"
      };

      await expect(MailService.sendMail(invalidData))
        .rejects.toThrow("Invalid email parameters: Invalid email address");
    });

    it("should reject empty subject", async () => {
      const invalidData: SendMailData = {
        to: "test@example.com",
        subject: "",
        text: "Test content"
      };

      await expect(MailService.sendMail(invalidData))
        .rejects.toThrow("Invalid email parameters: Subject cannot be empty");
    });

    it("should reject empty content", async () => {
      const invalidData: SendMailData = {
        to: "test@example.com",
        subject: "Test Subject",
        text: ""
      };

      await expect(MailService.sendMail(invalidData))
        .rejects.toThrow("Invalid email parameters: Email content cannot be empty");
    });

    it("should accept valid data", async () => {
      const validData: SendMailData = {
        to: "test@example.com",
        subject: "Valid Test",
        text: "Valid content"
      };

      await expect(MailService.sendMail(validData))
        .resolves.not.toThrow();
    });
  });

  describe("Error Handling", () => {
    it("should handle SMTP errors", async () => {
      const mailData: SendMailData = {
        to: "test@example.com",
        subject: "Test",
        text: "Content"
      };

      mockSendMail.mockRejectedValue(new Error("SMTP Connection failed"));

      await expect(MailService.sendMail(mailData))
        .rejects.toThrow("SMTP Connection failed");
    });
  });

  describe("Success", () => {
    it("should send email with correct parameters", async () => {
      const mailData: SendMailData = {
        to: "test@example.com",
        subject: "Test Subject",
        text: "Test email content"
      };

      await MailService.sendMail(mailData);

      expect(mockSendMail).toHaveBeenCalledWith({
        from: process.env.EMAIL_USER,
        to: "test@example.com",
        subject: "Test Subject",
        text: "Test email content"
      });
    });

    it("should trim whitespace", async () => {
      const mailData: SendMailData = {
        to: "test@example.com",
        subject: "  Test Subject  ",
        text: "  Test email content  "
      };

      await MailService.sendMail(mailData);

      expect(mockSendMail).toHaveBeenCalledWith({
        from: process.env.EMAIL_USER,
        to: "test@example.com",
        subject: "Test Subject",
        text: "Test email content"
      });
    });
  });
});