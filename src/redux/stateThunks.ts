import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getRecentlyPlayed, loadToken, searchForItem } from '@/helpers/requests';
import { RecentlyPlayedItem } from '@/types/recentlyPlayedApi';
import { Track } from '@/types/spotifyApi';
import { SearchResponse } from '@/types/searchApi';
import { trackArtistQuery } from '@/utils/utils';
import { AppDispatch, RootState } from './store';

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

export const searchResultsFetched = createAction<{ query: string; response: SearchResponse }>(
    'state/searchResultsFetched'
);

export const apiRequestFailed = createAction<{ message: string }>('state/apiRequestFailed');

export const searchForTrack = createAsyncThunk<
    Track | null,
    { name: string; artist: string; cacheOnly?: boolean },
    ThunkApi
>('state/searchForTrack', async ({ name, artist, cacheOnly = false }, thunkApi) => {
    const cache = thunkApi.getState().state.searchCache;
    const query = encodeURIComponent(trackArtistQuery(name, artist));

    let response = cache[query];

    if (!response) {
        if (cacheOnly) {
            return null;
        }

        const token = loadToken();

        if (!token) {
            return thunkApi.rejectWithValue('');
        }

        try {
            response = await searchForItem(token, query, ['track']);
            thunkApi.dispatch(searchResultsFetched({ query, response }));
        } catch (err) {
            thunkApi.dispatch(
                apiRequestFailed({ message: err instanceof Error ? err.message : 'Unknown error' })
            );
            return thunkApi.rejectWithValue('');
        }
    }

    if (!response.tracks) {
        return null;
    }

    return (
        response.tracks.items.find(
            track => track.name === name && track.artists.at(0)?.name === artist
        ) ?? null
    );
});

export const fetchHistoryDetails = createAsyncThunk<
    void,
    { cacheOnly?: boolean } | undefined,
    ThunkApi
    // eslint-disable-next-line default-param-last
>('state/fetchHistoryDetails', async ({ cacheOnly = false } = {}, thunkApi) => {
    const { history } = thunkApi.getState().state;

    for (const item of history) {
        await thunkApi.dispatch(
            searchForTrack({ name: item.trackName, artist: item.artistName, cacheOnly })
        );
    }
});
