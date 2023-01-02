import { Track } from './spotifyApi';

export interface SearchResponse {
    tracks?: Tracks;
}

interface Tracks {
    href: string;
    items: Track[];
    limit: number;
    next: null;
    offset: number;
    previous: null;
    total: number;
}
