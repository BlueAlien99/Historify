import { useAppSelector } from '@/redux/hooks';
import { selectPureHistory } from '@/redux/stateSelectors';
import { HistoryEntry } from '@/types/spotifyApi';

export const downloadHistory = (history: HistoryEntry[]) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(
        new Blob([JSON.stringify(history, undefined, 2)], { type: 'text/json' })
    );
    a.download = `spotify_history_${new Date().toISOString()}.json`;
    a.click();
    a.remove();
};

function DownloadHistory() {
    const history = useAppSelector(state => state.state.history);
    const pureHistory = useAppSelector(selectPureHistory);

    const disabled = !pureHistory.length;

    return (
        <div>
            <button
                type="button"
                className="btn"
                onClick={() => downloadHistory(history)}
                disabled={disabled}
            >
                Download history
            </button>
            <div className="stats">
                <span>Gaps: {disabled ? '' : history.filter(e => e.gap).length}</span>
                <span>Streams: {pureHistory.length || ''}</span>
                <span>From: {pureHistory.at(-1)?.played_at}</span>
                <span>To: {pureHistory.at(0)?.played_at}</span>
            </div>
        </div>
    );
}

export default DownloadHistory;
