import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { HistoryApiEntry } from '@/types/spotifyApi';
import { getRecentlyPlayed, loadToken } from '@/helpers/requests';
import { AppDispatch, RootState } from './store';
import { selectLastBackupEntry } from './stateSelectors';

export const historySliceFetched = createAction<HistoryApiEntry[]>('state/historySliceFetched');

export const fetchHistory = createAsyncThunk<
    void,
    void,
    { dispatch: AppDispatch; state: RootState }
>('state/fetchHistory', async (_, thunkApi) => {
    const token = loadToken();

    if (!token) {
        return thunkApi.rejectWithValue('');
    }

    const lastBackupEntry = selectLastBackupEntry(thunkApi.getState())?.played_at;

    let nextUrl: string | undefined;
    let end = false;

    while (!end) {
        const res = await getRecentlyPlayed(token, nextUrl);

        console.log(res);

        const newItems = res.items;
        nextUrl = res.next as typeof nextUrl;

        thunkApi.dispatch(historySliceFetched(newItems));

        if (
            (lastBackupEntry && (newItems.at(-1)?.played_at ?? '') <= lastBackupEntry) ||
            !nextUrl
        ) {
            end = true;
        }
    }
});
