// https://stackoverflow.com/a/59913241/8534821

const sha256 = async (plain: string) => {
    const data = new TextEncoder().encode(plain);
    return crypto.subtle.digest('SHA-256', data);
};

const base64URLEncode = (a: ArrayBuffer) =>
    // Convert the ArrayBuffer to string using Uint8 array.
    // btoa takes chars from 0-255 and base64 encodes.
    // Then convert the base64 encoded to base64url encoded.
    // (replace + with -, replace / with _, trim trailing =)

    btoa(String.fromCharCode.apply(null, new Uint8Array(a) as unknown as number[]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

export const pkceChallengeFromVerifier = async (v: string) => base64URLEncode(await sha256(v));

export const getQueryParams = () => new URLSearchParams(window.location.search);
