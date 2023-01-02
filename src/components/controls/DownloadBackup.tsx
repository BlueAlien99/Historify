import { useAppSelector } from '@/redux/hooks';
import { BackupFile, SearchCache } from '@/redux/stateSlice';
import { ExporterApiExtendedHistoryItem } from '@/types/exporterApi';

export const downloadBackup = (
    history: ExporterApiExtendedHistoryItem[],
    searchCache: SearchCache
) => {
    const liteHistory = history.map(({ track, ...item }) => item);

    const content: BackupFile['content'] = { history: liteHistory, searchCache };

    const a = document.createElement('a');
    a.href = URL.createObjectURL(
        new Blob([JSON.stringify(content, undefined, 2)], { type: 'text/json' })
    );
    a.download = `historify_data_${new Date().toISOString()}.json`;
    a.click();
    a.remove();
};

function DownloadBackup() {
    const history = useAppSelector(state => state.state.history);
    const searchCache = useAppSelector(state => state.state.searchCache);

    const searchCacheSize = Object.keys(searchCache).length;

    const enabled = !!(history.length || searchCacheSize);

    return (
        <div>
            <button
                type="button"
                className="btn"
                onClick={() => downloadBackup(history, searchCache)}
                disabled={!enabled}
            >
                Download history
            </button>
            <div className="stats">
                <span>Streams: {history.length}</span>
                <span>From: {history.at(0)?.endTime}</span>
                <span>To: {history.at(-1)?.endTime}</span>
                <span>Search cache items: {searchCacheSize}</span>
            </div>
        </div>
    );
}

export default DownloadBackup;
