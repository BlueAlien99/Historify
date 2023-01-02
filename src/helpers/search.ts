import { createAction } from '@reduxjs/toolkit';
import type { SearchCache } from '@/redux/stateSlice';
import type { AppDispatch } from '@/redux/store';
import { SearchResponse } from '@/types/searchApi';
import { Track } from '@/types/spotifyApi';
import { trackArtistQuery } from '@/utils/utils';
import { loadToken, searchForItem } from './requests';

// TODO: move to stateActions.ts

export const searchResultsFetched = createAction<{ query: string; response: SearchResponse }>(
    'state/searchResultsFetched'
);

export const apiRequestFailed = createAction<{ message: string }>('state/apiRequestFailed');

interface SearchForTrackProps {
    name: string;
    artist: string;
    cache: SearchCache;
    cacheOnly?: boolean;
    dispatch: AppDispatch;
}

export const searchForTrack = async ({
    name,
    artist,
    cache,
    cacheOnly = false,
    dispatch,
}: SearchForTrackProps): Promise<Track | null> => {
    const query = encodeURIComponent(trackArtistQuery(name, artist));

    let response = cache[query];

    if (!response) {
        if (cacheOnly) {
            return null;
        }

        const token = loadToken();

        if (!token) {
            const err = Error('No token');
            dispatch(apiRequestFailed({ message: err.message }));
            throw err;
        }

        try {
            response = await searchForItem(token, query, ['track']);
            dispatch(searchResultsFetched({ query, response }));
        } catch (err) {
            dispatch(
                apiRequestFailed({ message: err instanceof Error ? err.message : 'Unknown error' })
            );
            throw err;
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
};
