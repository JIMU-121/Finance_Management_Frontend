
function decodeJwt<T = Record<string, unknown>>(token: string): T | null {
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

export function isTokenValid(token: string): boolean {
    const payload = decodeJwt<{ exp?: number }>(token);
    if (!payload) return false;           
    if (!payload.exp) return true;        
    return payload.exp * 1000 > Date.now();
}
