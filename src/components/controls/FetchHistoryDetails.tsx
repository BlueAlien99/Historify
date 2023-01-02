import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchHistoryDetails } from '@/redux/stateThunks';

function FetchHistoryDetails() {
    const dispatch = useAppDispatch();

    const history = useAppSelector(rootState => rootState.state.history);
    const { requests, state, currentIndex } = useAppSelector(
        rootState => rootState.state.searchApi
    );
    const apiError = useAppSelector(rootState => rootState.state.apiError);

    const handleClick = () => void dispatch(fetchHistoryDetails());

    return (
        <div>
            <button
                type="button"
                className="btn"
                onClick={handleClick}
                disabled={state === 'pending'}
            >
                Fetch history details
            </button>
            <div className="stats">
                <span>State: {state}</span>
                <span>Status: {apiError || 'OK'}</span>
                <span>Requests: {requests || ''}</span>
                <span>
                    Progress: {currentIndex}/{history.length}
                </span>
                <span>Items without details: {history.filter(i => !i.track).length}</span>
            </div>
        </div>
    );
}

export default FetchHistoryDetails;
