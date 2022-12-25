export type HistoryEntry = HistoryApiEntry | Gap;

interface Gap {
    gap: true;
}

export interface HistoryApiEntry {
    track: Track;
    played_at: string;
    context: Context;
    gap: undefined;
}

interface Track {
    album: Album;
    artists: Artist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: Record<string, string | undefined>;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    is_local: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: 'track';
    uri: string;
}

interface Album {
    album_type: 'album' | 'single' | 'compilation';
    artists: Artist[];
    available_markets: string[];
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    name: string;
    release_date: string;
    release_date_precision: 'day' | 'month' | 'year';
    total_tracks: number;
    type: 'album';
    uri: string;
}

interface Artist {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: 'artist';
    uri: string;
}

interface Context {
    type: string;
    external_urls: ExternalUrls;
    href: string;
    uri: string;
}

interface Image {
    url: string;
    width: number;
    height: number;
}

interface ExternalUrls {
    spotify: string;
}
