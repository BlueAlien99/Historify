import { useMemo } from 'react';
import { msToMin, niceNumber } from '@/utils/utils';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getSortMark, sort } from '@/utils/stats';
import { sortConfigChanged } from '@/redux/stateSlice';
import { Artist } from '@/types/spotifyApi';

// TODO: use objects instead of error-prone tuples

type ArtistsStatsData = Array<readonly [Artist | string, number, number]>;

const getTableRow = (item: ArtistsStatsData[number]) => {
    const [artist, time, streams] = item;

    if (typeof artist === 'string') {
        return (
            <tr key={artist}>
                <td>⚠️ {artist}</td>
                <td>{msToMin(time)}</td>
                <td>{streams}</td>
            </tr>
        );
    }

    return (
        <tr key={artist.id}>
            <td>
                <a href={artist.external_urls.spotify} target="_blank" rel="noreferrer">
                    {artist.name}
                </a>
            </td>
            <td>{msToMin(time)}</td>
            <td>{niceNumber(streams)}</td>
        </tr>
    );
};

interface Props {
    data: ArtistsStatsData;
}

function ArtistsStatsTable({ data }: Props) {
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
                    {['Artist', 'Time', 'Streams'].map((c, i) => (
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

export default ArtistsStatsTable;
