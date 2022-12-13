import { useEffect, useMemo, useState } from 'react';
import {
    downloadHistory,
    getAuthURL,
    getToken,
    loadToken,
    getRecentlyPlayed,
    Token,
} from '@/helpers/requests';

function App() {
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
        <div className="App">
            <div id="controls">
                <button type="button" onClick={fetchHistory}>
                    Fetch history!
                </button>
                <button
                    type="button"
                    onClick={() => downloadHistory(history)}
                    disabled={!history.length}
                >
                    Download history!
                </button>
                <button type="button">CSS test!</button>
            </div>
        </div>
    );
}

export default App;
