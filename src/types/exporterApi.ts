import { Track } from './spotifyApi';

export interface ExporterApiHistoryItem {
    endTime: string;
    artistName: string;
    trackName: string;
    msPlayed: number;
}

export interface ExporterApiExtendedHistoryItem extends ExporterApiHistoryItem {
    track?: Track;
}
