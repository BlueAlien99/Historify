import { Track } from './spotifyApi';

export interface ExporterApiHistoryItemV1 {
    endTime: string;
    artistName: string;
    trackName: string;
    msPlayed: number;
}

export interface ExporterApiHistoryItemV2 {
    ts: string;
    master_metadata_album_artist_name?: string;
    master_metadata_track_name?: string;
    ms_played: number;
}

export type ExporterApiHistoryItem = ExporterApiHistoryItemV1 | ExporterApiHistoryItemV2;

export interface ExporterApiExtendedHistoryItem extends ExporterApiHistoryItemV1 {
    track?: Track;
}
