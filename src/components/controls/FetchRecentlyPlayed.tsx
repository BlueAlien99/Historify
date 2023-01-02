import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchRecentlyPlayed } from '@/redux/stateThunks';

function FetchRecentlyPlayed() {
    const dispatch = useAppDispatch();

    const recentlyPlayed = useAppSelector(rootState => rootState.state.recentlyPlayed);
    const { requests, state } = useAppSelector(rootState => rootState.state.recentlyPlayedApi);

    const handleClick = () => void dispatch(fetchRecentlyPlayed());

    return (
        <div>
            <button
                type="button"
                className="btn"
                onClick={handleClick}
                disabled={state === 'pending'}
            >
                Fetch recently played
            </button>
            <div className="stats">
                <span>State: {state}</span>
                <span>Requests: {requests || ''}</span>
                <span>Streams: {recentlyPlayed.length || ''}</span>
                <span>From: {recentlyPlayed.at(-1)?.played_at}</span>
                <span>To: {recentlyPlayed.at(0)?.played_at}</span>
            </div>
        </div>
    );
}

export default FetchRecentlyPlayed;
