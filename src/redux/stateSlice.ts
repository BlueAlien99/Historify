import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HistoryApiEntry, HistoryEntry } from '@/types/spotifyApi';
import { fetchHistory, historySliceFetched } from './stateThunks';
import { selectLastBackupEntry } from './stateSelectors';

interface BackupFile {
    filename: string;
    history: HistoryEntry[];
}

interface HistoryApi {
    state: 'idle' | 'pending' | 'succeeded' | 'failed';
    requests: number;
    history: HistoryApiEntry[];
}

interface AppState {
    history: HistoryEntry[];
    backupFile: BackupFile | null;
    historyApi: HistoryApi;
}

const initialState: AppState = {
    history: [],
    backupFile: null,
    historyApi: {
        state: 'idle',
        requests: 0,
        history: [],
    },
};

const stateSlice = createSlice({
    name: 'state',
    initialState,
    reducers: {
        backupFileLoaded: (state, { payload }: PayloadAction<BackupFile>) => {
            state.history = payload.history;
            state.backupFile = payload;
            state.historyApi = initialState.historyApi;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(historySliceFetched, (state, { payload }) => {
                state.historyApi.requests += 1;
                state.historyApi.history.push(...payload);
            })
            .addCase(fetchHistory.pending, state => {
                state.historyApi = {
                    ...initialState.historyApi,
                    state: 'pending',
                };
            })
            .addCase(fetchHistory.rejected, state => {
                state.historyApi.state = 'failed';
            })
            .addCase(fetchHistory.fulfilled, state => {
                state.historyApi.state = 'succeeded';

                if (!state.backupFile) {
                    state.history = state.historyApi.history;
                    return;
                }

                const lastBackupEntry = selectLastBackupEntry({ state })?.played_at ?? '';
                const fetchedOverlap = state.historyApi.history.findIndex(
                    e => e.played_at === lastBackupEntry
                );

                if (fetchedOverlap === -1) {
                    state.history = [
                        ...state.historyApi.history,
                        { gap: true },
                        ...state.backupFile.history,
                    ];
                    return;
                }

                state.history = [
                    ...state.historyApi.history.slice(
                        0,
                        fetchedOverlap - state.historyApi.history.length
                    ),
                    ...state.backupFile.history,
                ];
            });
    },
});

export const { backupFileLoaded } = stateSlice.actions;

export const stateReducer = stateSlice.reducer;
