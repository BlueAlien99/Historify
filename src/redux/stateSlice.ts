import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExporterApiExtendedHistoryItem, ExporterApiHistoryItem } from '@/types/exporterApi';
import { RecentlyPlayedItem } from '@/types/recentlyPlayedApi';
import { SearchResponse } from '@/types/searchApi';
import {
    apiRequestFailed,
    fetchHistoryDetails,
    fetchRecentlyPlayed,
    recentlyPlayedSliceFetched,
    searchForTrack,
    searchResultsFetched,
} from './stateThunks';

export type SearchCache = Record<string, SearchResponse | undefined>;

export interface BackupFile {
    filename: string;
    content:
        | ExporterApiHistoryItem[]
        | { history: ExporterApiHistoryItem[]; searchCache: SearchCache };
}

interface RecentlyPlayedApi {
    state: 'idle' | 'pending' | 'succeeded' | 'failed';
    requests: number;
}

// TODO: apiError per api
interface SearchApi extends RecentlyPlayedApi {
    currentIndex: number;
}

export interface SortConfig {
    col: number;
    asc: boolean;
}

// ^^^ Additional types ^^^

interface AppState {
    history: ExporterApiExtendedHistoryItem[];
    recentlyPlayed: RecentlyPlayedItem[];
    backupFilename: string | undefined;
    recentlyPlayedApi: RecentlyPlayedApi;
    searchApi: SearchApi;
    apiError: string | null;
    searchCache: SearchCache;
    sortConfig: SortConfig;
}

const initialState: AppState = {
    history: [],
    recentlyPlayed: [],
    backupFilename: undefined,
    recentlyPlayedApi: {
        state: 'idle',
        requests: 0,
    },
    searchApi: {
        state: 'idle',
        requests: 0,
        currentIndex: 0,
    },
    apiError: null,
    searchCache: {},
    sortConfig: { col: 1, asc: false },
};

const stateSlice = createSlice({
    name: 'state',
    initialState,
    reducers: {
        backupFileLoaded: (state, { payload }: PayloadAction<BackupFile>) => {
            state.backupFilename = payload.filename;

            if (Array.isArray(payload.content)) {
                state.history = payload.content;
            } else {
                state.history = payload.content.history;
                state.searchCache = payload.content.searchCache;
            }
        },
        sortConfigChanged: (state, { payload }: PayloadAction<{ col: number }>) => {
            const prevSort = state.sortConfig;

            if (payload.col === prevSort.col) {
                state.sortConfig.asc = !prevSort.asc;
            } else {
                state.sortConfig.col = payload.col;
            }
        },
    },
    extraReducers: builder => {
        builder
            .addCase(recentlyPlayedSliceFetched, (state, { payload }) => {
                state.recentlyPlayedApi.requests += 1;
                state.recentlyPlayed.push(...payload);
            })
            .addCase(fetchRecentlyPlayed.pending, state => {
                state.recentlyPlayedApi = {
                    ...initialState.recentlyPlayedApi,
                    state: 'pending',
                };
                state.recentlyPlayed = [];
            })
            .addCase(fetchRecentlyPlayed.rejected, state => {
                state.recentlyPlayedApi.state = 'failed';
            })
            .addCase(fetchRecentlyPlayed.fulfilled, state => {
                state.recentlyPlayedApi.state = 'succeeded';
            })
            .addCase(searchResultsFetched, (state, { payload }) => {
                state.searchCache[payload.query] = payload.response;
            })
            .addCase(apiRequestFailed, (state, { payload }) => {
                state.apiError = payload.message;
            })
            // TODO:
            // .addCase(searchForTrack.pending, (state) => {
            // })
            // .addCase(searchForTrack.rejected, (state) => {
            // })
            .addCase(searchForTrack.fulfilled, (state, { payload }) => {
                const item = state.history[state.searchApi.currentIndex];

                if (
                    payload &&
                    item.trackName === payload.name &&
                    item.artistName === payload.artists.at(0)?.name
                ) {
                    item.track = payload;
                }
                state.searchApi.currentIndex += 1;
            })
            .addCase(fetchHistoryDetails.pending, state => {
                state.searchApi = {
                    ...initialState.searchApi,
                    state: 'pending',
                };
            })
            .addCase(fetchHistoryDetails.rejected, state => {
                state.searchApi.state = 'failed';
            })
            .addCase(fetchHistoryDetails.fulfilled, state => {
                state.searchApi.state = 'succeeded';
            });
    },
});

export const { backupFileLoaded, sortConfigChanged } = stateSlice.actions;

export const stateReducer = stateSlice.reducer;
