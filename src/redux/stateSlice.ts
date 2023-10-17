import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    ExporterApiExtendedHistoryItem,
    ExporterApiHistoryItem,
    ExporterApiHistoryItemV1,
    ExporterApiHistoryItemV2,
} from '@/types/exporterApi';
import { RecentlyPlayedItem } from '@/types/recentlyPlayedApi';
import { SearchResponse } from '@/types/searchApi';
import { apiRequestFailed, searchResultsFetched } from '@/helpers/search';
import { exporterApiHistoryItemV2ToV1, isExporterApiHistoryItemV2 } from '../utils/types';
import {
    fetchHistoryDetails,
    fetchRecentlyPlayed,
    historyDetailsProgress,
    recentlyPlayedSliceFetched,
} from './stateThunks';

export type SearchCache = Record<string, SearchResponse | undefined>;

export interface BackupFile {
    filename: string;
    content:
        | ExporterApiHistoryItem[]
        | { history: ExporterApiHistoryItemV1[]; searchCache: SearchCache };
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
        // TODO: requests are not used anywhere
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

            // TODO: refactor and remove casting

            if (Array.isArray(payload.content) && isExporterApiHistoryItemV2(payload.content[0])) {
                state.history = (payload.content as ExporterApiHistoryItemV2[])
                    .map(exporterApiHistoryItemV2ToV1)
                    .sort((a, b) => a.endTime.localeCompare(b.endTime));
                return;
            }

            if (Array.isArray(payload.content)) {
                state.history = payload.content as ExporterApiHistoryItemV1[];
                return;
            }

            state.history = payload.content.history;
            state.searchCache = payload.content.searchCache;
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
            .addCase(historyDetailsProgress, (state, { payload }) => {
                state.searchApi.currentIndex = payload;
            })
            .addCase(fetchHistoryDetails.pending, state => {
                state.searchApi = {
                    ...initialState.searchApi,
                    state: 'pending',
                };
                state.apiError = null;
            })
            .addCase(fetchHistoryDetails.rejected, state => {
                state.searchApi.state = 'failed';
            })
            .addCase(fetchHistoryDetails.fulfilled, (state, { payload }) => {
                state.history = payload.history;
                state.searchApi.state = 'succeeded';
            });
    },
});

export const { backupFileLoaded, sortConfigChanged } = stateSlice.actions;

export const stateReducer = stateSlice.reducer;
