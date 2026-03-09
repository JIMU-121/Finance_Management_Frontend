/**
 * Decode a JWT token without verifying the signature.
 * (Verification should always happen server-side.)
 */
export function decodeJwt<T = Record<string, unknown>>(token: string): T | null {
    try {
        const base64Payload = token.split(".")[1];
        if (!base64Payload) return null;

        // atob needs standard base64, JWT uses base64url
        const json = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(json) as T;
    } catch {
        return null;
    }
}

/**
 * Returns true if the token is decodable and not expired.
 * Tokens with no `exp` claim are treated as non-expiring (valid).
 */
export function isTokenValid(token: string): boolean {
    const payload = decodeJwt<{ exp?: number }>(token);
    if (!payload) return false;           // can't decode = invalid
    if (!payload.exp) return true;        // no expiry claim = treat as valid
    return payload.exp * 1000 > Date.now();
}
