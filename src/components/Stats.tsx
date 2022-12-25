import { Artist, HistoryApiEntry, Track } from '@/types/spotifyApi';
import { msToMin } from '@/utils/utils';
import StatsTable from './StatsTable';

type TrackAggr = Record<
    string,
    {
        track: Track;
        count: number;
    }
>;

type ArtistAggr = Record<
    string,
    {
        artist: Artist;
        tracks: TrackAggr;
    }
>;

const addTrackToAggr = (aggr: TrackAggr, track: Track) => {
    if (track.id in aggr) {
        aggr[track.id].count += 1;
    } else {
        aggr[track.id] = {
            track,
            count: 1,
        };
    }
};

const normalizeTracks = (tracks: TrackAggr) =>
    Object.entries(tracks).map(
        ([_, { track, count }]) => [track, track.duration_ms * count, count] as const
    );

const normalizeArtists = (artists: ArtistAggr) =>
    Object.entries(artists).map(([__, { artist, tracks }]) => {
        const nt = Object.entries(tracks).reduce(
            (acc, [_, { track, count }]) => ({
                duration: acc.duration + track.duration_ms * count,
                count: acc.count + count,
            }),
            { duration: 0, count: 0 }
        );

        return [artist, nt.duration, nt.count] as const;
    });

interface Props {
    history: HistoryApiEntry[];
}

function Stats({ history }: Props) {
    const totalTime = history.reduce((acc, cur) => acc + cur.track.duration_ms, 0);

    const trackAggr: TrackAggr = {};
    const artistAggr: ArtistAggr = {};

    history.forEach(({ track }) => {
        addTrackToAggr(trackAggr, track);

        track.artists.forEach(artist => {
            if (!(artist.id in artistAggr)) {
                artistAggr[artist.id] = {
                    artist,
                    tracks: {},
                };
            }

            addTrackToAggr(artistAggr[artist.id].tracks, track);
        });
    });

    const normalizedTracks = normalizeTracks(trackAggr);
    const normalizedArtists = normalizeArtists(artistAggr);

    return (
        <>
            <span>Total time: {msToMin(totalTime)}</span>
            <span>Total tracks: {history.length}</span>
            <StatsTable name="Artist" data={normalizedArtists} />
            <StatsTable name="Track" data={normalizedTracks} />
        </>
    );
}

export default Stats;
