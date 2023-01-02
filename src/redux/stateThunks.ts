import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getRecentlyPlayed, loadToken } from '@/helpers/requests';
import { RecentlyPlayedItem } from '@/types/recentlyPlayedApi';
import { ExporterApiExtendedHistoryItem } from '@/types/exporterApi';
import { searchForTrack } from '@/helpers/search';
import type { AppDispatch, RootState } from './store';

interface ThunkApi {
    dispatch: AppDispatch;
    state: RootState;
}

export const recentlyPlayedSliceFetched = createAction<RecentlyPlayedItem[]>(
    'state/recentlyPlayedSliceFetched'
);

export const fetchRecentlyPlayed = createAsyncThunk<void, void, ThunkApi>(
    'state/fetchRecentlyPlayed',
    async (_, thunkApi) => {
        const token = loadToken();

        if (!token) {
            return thunkApi.rejectWithValue('');
        }

        let nextUrl: string | undefined;
        let end = false;

        while (!end) {
            const res = await getRecentlyPlayed(token, nextUrl);

            const newItems = res.items;
            nextUrl = res.next as typeof nextUrl;

            thunkApi.dispatch(recentlyPlayedSliceFetched(newItems));

            if (!nextUrl) {
                end = true;
            }
        }
    }
);

export const historyDetailsProgress = createAction<number>('state/historyDetailsProgress');

export const fetchHistoryDetails = createAsyncThunk<
    { history: ExporterApiExtendedHistoryItem[] },
    { cacheOnly?: boolean } | undefined,
    ThunkApi
    // eslint-disable-next-line default-param-last
>('state/fetchHistoryDetails', async ({ cacheOnly = false } = {}, thunkApi) => {
    const history = [...thunkApi.getState().state.history];

    let isError = false;

    for (let i = 0; i < history.length; i += 1) {
        const item = history[i];
        const cache = thunkApi.getState().state.searchCache;

        // TODO: skip detailed data?

        const result = await searchForTrack({
            name: item.trackName,
            artist: item.artistName,
            cache,
            cacheOnly: cacheOnly || isError,
            dispatch: thunkApi.dispatch,
            // eslint-disable-next-line no-loop-func
        }).catch(() => {
            isError = true;
            return null;
        });

        if (
            result &&
            item.trackName === result.name &&
            item.artistName === result.artists.at(0)?.name
        ) {
            history[i] = { ...item, track: result };
            thunkApi.dispatch(historyDetailsProgress(i));
        }
    }

    thunkApi.dispatch(historyDetailsProgress(history.length));
    return { history };
});
