import { useEffect, useMemo, useState } from 'react';
import {
    downloadHistory,
    getAuthURL,
    getToken,
    loadToken,
    getRecentlyPlayed,
    Token,
} from '@/helpers/requests';
import FileInput from './FileInput';

function Controls() {
    const token = useMemo(loadToken, []);
    const [history, setHistory] = useState([] as any[]);

    useEffect(() => {
        if (window.location.pathname.startsWith('/callback')) {
            void getToken().then(body => {
                if ('access_token' in body) {
                    sessionStorage.setItem('token', JSON.stringify(body));
                    window.location.href = '/';
                }
            });
            return;
        }
        if (loadToken() === null) {
            void getAuthURL().then(url => {
                window.location.href = url;
            });
        }
    }, []);

    const fetchHistory = () => {
        void getRecentlyPlayed(token as Token).then(items =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
            setHistory(oldHistory => [...oldHistory, ...items])
        );
    };

    return (
        <div id="controls">
            <FileInput />
            <button type="button" className="btn" onClick={fetchHistory}>
                Fetch history!
            </button>
            <button
                type="button"
                className="btn"
                onClick={() => downloadHistory(history)}
                disabled={!history.length}
            >
                Download history!
            </button>
        </div>
    );
}

export default Controls;
