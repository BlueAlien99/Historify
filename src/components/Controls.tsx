import { useEffect } from 'react';
import { getAuthURL, getToken, loadToken } from '@/helpers/requests';
import FileInput from './controls/FileInput';
import FetchHistory from './controls/FetchHistory';
import DownloadHistory from './controls/DownloadHistory';

function Controls() {
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

    return (
        <div id="controls">
            <FileInput />
            <FetchHistory />
            <DownloadHistory />
        </div>
    );
}

export default Controls;
