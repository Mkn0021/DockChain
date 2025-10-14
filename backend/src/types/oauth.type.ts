export interface OAuthProfile {
    id: string;
    email: string;
    name: string;
    picture?: string;
    provider: string;
}

export interface GoogleUserInfo {
    id: string;
    email: string;
    name: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    verified_email?: boolean;
}

export abstract class OAuthProvider {
    abstract getAuthUrl(): string;
    abstract handleCallback(code: string): Promise<OAuthProfile>;
}
