import { ExternalUrls, Track } from './spotifyApi';

export interface RecentlyPlayedResponse {
    cursors: { after: string; before: string };
    href: string;
    items: RecentlyPlayedItem[];
    limit: number;
    next: string | null;
}

export interface RecentlyPlayedItem {
    track: Track;
    played_at: string;
    context: Context;
}

interface Context {
    type: string;
    external_urls: ExternalUrls;
    href: string;
    uri: string;
}
