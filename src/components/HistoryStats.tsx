import { ExporterApiExtendedHistoryItem, ExporterApiHistoryItemV1 } from '@/types/exporterApi';
import { Artist, Track } from '@/types/spotifyApi';
import { msToMin, niceNumber, trackArtistQuery } from '@/utils/utils';
import ArtistsStatsTable from './ArtistsStatsTable';
import TracksStatsTable from './TracksStatsTable';

// TODO: noUncheckedIndexedAccess? Aggr value | undefined

type TrackAggr = Record<
    string,
    {
        track: Track | Pick<ExporterApiHistoryItemV1, 'trackName' | 'artistName'>;
        count: number;
        duration: number;
    }
>;

type ArtistAggr = Record<
    string,
    {
        artist: Artist | string;
        tracks: TrackAggr;
    }
>;

const addTrackToAggr = (aggr: TrackAggr, track: ExporterApiExtendedHistoryItem) => {
    const key = trackArtistQuery(track.trackName, track.artistName);

    if (key in aggr) {
        if ('trackName' in aggr[key].track && track.track) {
            aggr[key].track = track.track;
        }

        aggr[key].count += 1;
        aggr[key].duration += track.msPlayed;
    } else {
        aggr[key] = {
            track: track.track ?? track,
            count: 1,
            duration: track.msPlayed,
        };
    }
};

const normalizeTracks = (tracks: TrackAggr) =>
    Object.entries(tracks).map(
        ([_, { track, count, duration }]) =>
            [track, duration, 'trackName' in track ? count : duration / track.duration_ms] as const
    );

const normalizeArtists = (artists: ArtistAggr) =>
    Object.entries(artists).map(([__, { artist, tracks }]) => {
        const nt = Object.entries(tracks).reduce(
            (acc, [_, { track, count, duration }]) => ({
                duration: acc.duration + duration,
                count: acc.count + ('trackName' in track ? count : duration / track.duration_ms),
            }),
            { duration: 0, count: 0 }
        );

        return [artist, nt.duration, nt.count] as const;
    });

interface Props {
    data: Array<ExporterApiExtendedHistoryItem>;
}

function HistoryStats({ data }: Props) {
    const totalTime = data.reduce((acc, cur) => acc + cur.msPlayed, 0);
    const totalStreams = data.reduce(
        (acc, cur) => acc + (cur.track ? cur.msPlayed / cur.track.duration_ms : 1),
        0
    );

    const trackAggr: TrackAggr = {};
    const artistAggr: ArtistAggr = {};

    data.forEach(track => {
        addTrackToAggr(trackAggr, track);

        if (track.track) {
            track.track.artists.forEach(artist => {
                if (typeof artistAggr[artist.name]?.artist === 'string') {
                    artistAggr[artist.name].artist = artist;
                }

                if (!(artist.name in artistAggr)) {
                    artistAggr[artist.name] = {
                        artist,
                        tracks: {},
                    };
                }

                addTrackToAggr(artistAggr[artist.name].tracks, track);
            });
        } else {
            if (!(track.artistName in artistAggr)) {
                artistAggr[track.artistName] = {
                    artist: track.artistName,
                    tracks: {},
                };
            }

            addTrackToAggr(artistAggr[track.artistName].tracks, track);
        }
    });

    const normalizedTracks = normalizeTracks(trackAggr);
    const normalizedArtists = normalizeArtists(artistAggr);

    return (
        <>
            <span>Total time: {msToMin(totalTime)}</span>
            <span>Total streams: {niceNumber(totalStreams)}</span>
            <ArtistsStatsTable data={normalizedArtists} />
            <TracksStatsTable data={normalizedTracks} />
        </>
    );
}

export default HistoryStats;
