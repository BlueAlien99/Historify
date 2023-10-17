import { ExporterApiHistoryItemV1, ExporterApiHistoryItemV2 } from '../types/exporterApi';

export const isExporterApiHistoryItemV2 = (item: unknown): item is ExporterApiHistoryItemV2 => {
    if (item && typeof item === 'object' && 'ts' in item && 'ms_played' in item) {
        return true;
    }
    return false;
};

export const exporterApiHistoryItemV2ToV1 = (
    item: ExporterApiHistoryItemV2
): ExporterApiHistoryItemV1 => ({
    endTime: item.ts,
    artistName: item.master_metadata_album_artist_name ?? '? other content ?',
    trackName: item.master_metadata_track_name ?? '? other content ?',
    msPlayed: item.ms_played,
});
