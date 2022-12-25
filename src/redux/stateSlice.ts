import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HistoryEntry } from '@/types/spotifyApi';

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

// export const selectCount = (state: RootState) => state.counter.value

export const stateReducer = stateSlice.reducer;
