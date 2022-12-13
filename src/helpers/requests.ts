import qs from 'qs';
import { getQueryParams, pkceChallengeFromVerifier } from '@/utils/utils';

const BASE_URI = 'https://api.spotify.com/v1';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID as string;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET as string;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI as string;

export interface Token {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
}

export const loadToken = (): Token | null => {
    const token = sessionStorage.getItem('token');
    return token === null ? null : (JSON.parse(token) as Token);
};

export const getAuthURL = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const codeVerifier = [...Array(3)].map(() => crypto.randomUUID()).join('');
    sessionStorage.setItem('code_verifier', codeVerifier);

    const query = {
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        scope: 'user-read-recently-played',
        code_challenge_method: 'S256',
        code_challenge: await pkceChallengeFromVerifier(codeVerifier),
    };

    return `https://accounts.spotify.com/authorize?${qs.stringify(query)}`;
};

export const getToken = () => {
    const code = getQueryParams().get('code');
    const auth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

    const body = {
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        code_verifier: sessionStorage.getItem('code_verifier'),
    };

    return fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: qs.stringify(body),
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }).then(res => res.json());
};

export const getRecentlyPlayed = (token: Token) =>
    fetch(`${BASE_URI}/me/player/recently-played?limit=50`, {
        headers: {
            Authorization: `${token.token_type} ${token.access_token}`,
            'Content-Type': 'application/json',
        },
    })
        .then(res => res.json())
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        .then(data => data.items as unknown[]);

export const downloadHistory = (history: any[]) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(
        new Blob([JSON.stringify(history, undefined, 2)], { type: 'text/json' })
    );
    a.download = 'spotify_history.json';
    a.click();
    a.remove();
};
