import request from "supertest";
import express, { Request, Response } from "express";
import { env } from "@config/env";
import { securityMiddleware, rateLimiter, sanitizeInput } from "@middlewares/security";

const app = express();
app.use(express.json());
app.use(...securityMiddleware);
app.use(rateLimiter);

app.post("/test/:id", sanitizeInput, (req: Request, res: Response) => {
    res.json({
        body: req.body,
        query: req.query,
        params: req.params
    });
});

describe("Security Middleware Suite", () => {
    it("should apply helmet and cors successfully", async () => {
        const res = await request(app)
            .post("/test/123")
            .set("Origin", env.ALLOWED_ORIGINS?.split(",")[0] || "http://localhost")
            .send({ name: "test" });

        // Helmet sets security headers
        expect(res.headers["x-dns-prefetch-control"]).toBeDefined();
        expect(res.headers["x-frame-options"]).toBeDefined();

        // CORS headers
        expect(res.headers["access-control-allow-origin"]).toBeDefined();
    });

    it("should sanitize body, query, and params", async () => {
        const maliciousBody = {
            name: "<script>alert('xss')</script>",
            attr: 'onclick="evil()"'
        };

        const maliciousQuery = { param: "<script>badQuery</script>" };
        const maliciousParam = "<script>badParam</script>";

        const res = await request(app)
            .post(`/test/${encodeURIComponent(maliciousParam)}`)
            .query(maliciousQuery)
            .set("Content-Type", "application/json")
            .send(maliciousBody);

        expect(res.body.body.name).not.toContain("<script>");
        expect(res.body.body.attr).not.toContain("onclick");
        expect(res.body.params.id).not.toContain("<script>");
        expect(res.body.query.param).not.toContain("<script>");
    });


    it("should limit requests after threshold", async () => {
        const limitApp = express();
        limitApp.use(express.json());
        limitApp.use(rateLimiter);
        limitApp.get("/rate", (_req, res) => res.send("ok"));

        // Send requests up to the limit
        for (let i = 0; i < 100; i++) {
            await request(limitApp).get("/rate");
        }

        // 101st request should be blocked
        const res = await request(limitApp).get("/rate");
        expect(res.status).toBe(429);
        expect(res.body.error).toBeDefined();
        expect(res.body.success).toBe(false);
    });
});
