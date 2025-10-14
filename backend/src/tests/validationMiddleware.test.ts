import { z, ZodError } from "zod";
import { validateRequest } from "../api/middlewares/validation";

describe("validateRequest middleware", () => {
    it("calls next() when request matches schema", () => {
        const schema = z.object({
            body: z.object({ name: z.string() }),
            query: z.any(),
            params: z.any(),
        });

        const req = { body: { name: "ok" }, query: {}, params: {} } as any;
        const res = {} as any;
        const next = jest.fn();

        const mw = validateRequest(schema);
        mw(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        // called without an error
        expect(next).toHaveBeenCalledWith();
    });

    it("forwards ZodError to next when validation fails", () => {
        const schema = z.object({
            body: z.object({ name: z.string() }),
            query: z.any(),
            params: z.any(),
        });

        const req = { body: { }, query: {}, params: {} } as any; // missing name
        const res = {} as any;
        const next = jest.fn();

        const mw = validateRequest(schema);
        mw(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(expect.any(ZodError));
    });

    it("forwards non-Zod errors to next unchanged", () => {
        // Create a fake schema object that throws a generic Error from parse
        const fakeSchema = ({ parse: () => { throw new Error("boom"); } } as unknown) as z.ZodType<any>;

        const req = { body: {}, query: {}, params: {} } as any;
        const res = {} as any;
        const next = jest.fn();

        const mw = validateRequest(fakeSchema);
        mw(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
        expect((next.mock.calls[0][0] as Error).message).toBe("boom");
    });
});
