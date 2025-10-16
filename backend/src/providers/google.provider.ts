import { env } from '@config/env';
import APIError from '@api/errors';
import { OAuth2Client } from 'google-auth-library';
import { OAuthProfile, OAuthProvider, GoogleUserInfo } from '@type/oauth.type';

export class GoogleProvider extends OAuthProvider {
    private client: OAuth2Client;

    constructor() {
        super();
        this.client = new OAuth2Client(
            env.GOOGLE_CLIENT_ID,
            env.GOOGLE_CLIENT_SECRET,
            `${env.BASE_URL}/api/auth/google/callback`
        );
    }

    getAuthUrl(): string {
        return this.client.generateAuthUrl({
            scope: ['profile', 'email'],
            prompt: 'consent'
        });
    }

    async handleCallback(code: string): Promise<OAuthProfile> {
        try {
            const { tokens } = await this.client.getToken(code);
            this.client.setCredentials(tokens);

            const response = await this.client.request<GoogleUserInfo>({
                url: 'https://www.googleapis.com/oauth2/v2/userinfo'
            });

            const userData = response.data;

            return {
                id: userData.id,
                email: userData.email,
                name: userData.name,
                picture: userData.picture,
                provider: 'google'
            };
        } catch {
            throw APIError.unauthorized('Google authentication failed');
        }
    }
}