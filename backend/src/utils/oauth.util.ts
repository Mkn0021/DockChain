import APIError from "@api/errors";
import { OAuthProfile, OAuthProvider } from "@type/oauth.type";

export class OAuthManager {
    private static providers = new Map<string, OAuthProvider>();

    static register(provider: string, instance: OAuthProvider) {
        this.providers.set(provider, instance);
    }

    static get(provider: string): OAuthProvider {
        const instance = this.providers.get(provider);
        if (!instance) throw APIError.badRequest(`Provider ${provider} not supported`);
        return instance;
    }

    static getAuthUrl(provider: string): string {
        return this.get(provider).getAuthUrl();
    }

    static async handleCallback(provider: string, code: string): Promise<OAuthProfile> {
        return this.get(provider).handleCallback(code);
    }
}