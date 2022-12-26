import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchHistory } from '@/redux/stateThunks';

function FetchHistory() {
    const dispatch = useAppDispatch();

    const { history, requests, state } = useAppSelector(rootState => rootState.state.historyApi);

    const handleClick = () => void dispatch(fetchHistory());

    return (
        <div>
            <button
                type="button"
                className="btn"
                onClick={handleClick}
                disabled={state === 'pending'}
            >
                Fetch history
            </button>
            <div className="stats">
                <span>State: {state}</span>
                <span>Requests: {requests || ''}</span>
                <span>Streams: {history.length || ''}</span>
                <span>From: {history.at(-1)?.played_at}</span>
                <span>To: {history.at(0)?.played_at}</span>
            </div>
        </div>
    );
}

export default FetchHistory;
