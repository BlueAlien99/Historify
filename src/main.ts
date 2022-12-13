import "./style.css";

import qs from "qs";

import { pkceChallengeFromVerifier, getQueryParams } from "./utils";

const BASE_URI = "https://api.spotify.com/v1";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

interface Token {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
}

const fetchHistoryBtn = document.querySelector("#fetch-history");
const downloadHistoryBtn = document.querySelector("#download-history");

const loadToken = (): Token | null => {
    const token = sessionStorage.getItem("token");
    return token === null ? null : JSON.parse(token);
};

const authorize = async () => {
    const codeVerifier = [...Array(3)].map(() => crypto.randomUUID()).join("");
    sessionStorage.setItem("code_verifier", codeVerifier);

    const query = {
        client_id: CLIENT_ID,
        response_type: "code",
        redirect_uri: REDIRECT_URI,
        scope: "user-read-recently-played",
        code_challenge_method: "S256",
        code_challenge: await pkceChallengeFromVerifier(codeVerifier),
    };

    location.href = `https://accounts.spotify.com/authorize?${qs.stringify(
        query
    )}`;
};

const getToken = () => {
    const code = getQueryParams().get("code");
    const auth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

    const body = {
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        code_verifier: sessionStorage.getItem("code_verifier"),
    };

    return fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        body: qs.stringify(body),
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
        .then((res) => res.json())
        .then((body) => {
            sessionStorage.setItem("token", JSON.stringify(body));
            location.href = "/";
        });
};

const getRecentlyPlayed = (token: Token, history: any[]) =>
    fetch(`${BASE_URI}/me/player/recently-played?limit=50`, {
        headers: {
            Authorization: `${token.token_type} ${token.access_token}`,
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => {
            history.push(...data.items);
            if (history.length) {
                downloadHistoryBtn?.removeAttribute("disabled");
            }
        });

const downloadHistory = (history: any[]) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
        new Blob([JSON.stringify(history, undefined, 2)], { type: "text/json" })
    );
    a.download = "spotify_history.json";
    a.click();
    a.remove();
};

const init = async () => {
    const token = loadToken();
    const history: any[] = [];

    if (location.pathname.startsWith("/callback")) {
        return getToken();
    }
    if (token === null) {
        return authorize();
    }

    fetchHistoryBtn?.addEventListener("click", () =>
        getRecentlyPlayed(token, history)
    );
    downloadHistoryBtn?.addEventListener("click", () => downloadHistory(history));
};

init();
