import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HistoryApiEntry, HistoryEntry } from '@/types/spotifyApi';
import { RootState } from './store';

interface BackupFile {
    filename: string;
    history: HistoryEntry[];
}

interface AppState {
    history: HistoryEntry[];
    backupFile: BackupFile | null;
}

const initialState: AppState = {
    history: [],
    backupFile: null,
};

const stateSlice = createSlice({
    name: 'state',
    initialState,
    reducers: {
        backupFileLoaded: (state, { payload }: PayloadAction<BackupFile>) => {
            state.history = payload.history;
            state.backupFile = payload;
        },
    },
    // extraReducers: builder => {},
});

export const { backupFileLoaded } = stateSlice.actions;

export const selectPureHistory = (state: RootState) =>
    state.state.history.filter(e => !e.gap) as HistoryApiEntry[];

export const stateReducer = stateSlice.reducer;
