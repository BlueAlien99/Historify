import { useMemo } from 'react';
import { msToMin, niceNumber } from '@/utils/utils';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getSortMark, sort } from '@/utils/stats';
import { sortConfigChanged } from '@/redux/stateSlice';
import { Track } from '@/types/spotifyApi';
import { ExporterApiHistoryItem } from '@/types/exporterApi';

// TODO: use objects instead of error-prone tuples

type TracksStatsData = Array<
    readonly [Track | Pick<ExporterApiHistoryItem, 'trackName' | 'artistName'>, number, number]
>;

const getTableRow = (item: TracksStatsData[number]) => {
    const [track, time, streams] = item;

    if ('trackName' in track) {
        return (
            <tr key={`${track.trackName}+${track.artistName}`}>
                <td>
                    ⚠️ {track.trackName}
                    <span id="track-artists">{track.artistName}</span>
                </td>
                <td>{msToMin(time)}</td>
                <td>{streams}</td>
            </tr>
        );
    }

    return (
        <tr key={track.id}>
            <td>
                <a href={track.external_urls.spotify} target="_blank" rel="noreferrer">
                    {track.name}
                </a>
                <span id="track-artists">{track.artists.map(a => a.name).join(', ')}</span>
            </td>
            <td>{msToMin(time)}</td>
            <td>{niceNumber(streams)}</td>
        </tr>
    );
};

interface Props {
    data: TracksStatsData;
}

function TracksStatsTable({ data }: Props) {
    const sortConfig = useAppSelector(state => state.state.sortConfig);

    const dispatch = useAppDispatch();

    const sortedData = useMemo(() => sort(data, sortConfig), [sortConfig, data]);

    const changeSortMode = (col: number) => () => dispatch(sortConfigChanged({ col }));

    return (
        <table id="stats-table">
            <colgroup>
                <col span={1} style={{ width: '100%' }} />
                <col span={1} style={{ minWidth: '10ch' }} />
                <col span={1} style={{ minWidth: '10ch' }} />
            </colgroup>
            <thead>
                <tr>
                    {['Track', 'Time', 'Streams'].map((c, i) => (
                        <th onClick={changeSortMode(i)} key={c}>
                            {c} {getSortMark(i, sortConfig)}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>{sortedData.map(getTableRow)}</tbody>
        </table>
    );
}

export default TracksStatsTable;
