import { useEffect } from 'react';
import { getAuthURL, getToken, loadToken } from '@/helpers/requests';
import FileInput from './controls/FileInput';
import FetchRecentlyPlayed from './controls/FetchRecentlyPlayed';
import DownloadBackup from './controls/DownloadBackup';
import FetchHistoryDetails from './controls/FetchHistoryDetails';

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
            <FetchRecentlyPlayed />
            <FileInput />
            <FetchHistoryDetails />
            <DownloadBackup />
        </div>
    );
}

export default Controls;
