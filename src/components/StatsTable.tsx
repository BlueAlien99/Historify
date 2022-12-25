import { useMemo, useState } from 'react';
import { Artist, Track } from '@/types/spotifyApi';
import { msToMin } from '@/utils/utils';

// TODO: use objects instead of error-prone tuples
type Data = Array<readonly [Artist | Track, number, number]>;

interface SortConfig {
    col: number;
    asc: boolean;
}

const sort = (data: Data, { col, asc }: SortConfig) =>
    // TODO:
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data.sort((a, b) => (asc ? a[col] - b[col] : b[col] - a[col]));

interface Props {
    name: 'Artist' | 'Track';
    data: Data;
}

function StatsTable({ name, data }: Props) {
    const [sortConfig, setSortConfig] = useState<SortConfig>({ col: 1, asc: false });

    const sortedData = useMemo(() => sort(data, sortConfig), [sortConfig, data]);

    const changeSortMode = (col: number) => () =>
        setSortConfig(prevSort =>
            col === prevSort.col ? { ...prevSort, asc: !prevSort.asc } : { ...prevSort, col }
        );

    const getSortMark = (col: number) => {
        if (col !== sortConfig.col) {
            return '';
        }

        return sortConfig.asc ? '⬆️' : '⬇️';
    };

    return (
        <table id="stats-table">
            <colgroup>
                <col span={1} style={{ width: '100%' }} />
                <col span={1} style={{ minWidth: '8ch' }} />
                <col span={1} style={{ minWidth: '8ch' }} />
            </colgroup>
            <thead>
                <tr>
                    <th>{name}</th>
                    <th onClick={changeSortMode(1)}>Time {getSortMark(1)}</th>
                    <th onClick={changeSortMode(2)}>Tracks {getSortMark(2)}</th>
                </tr>
            </thead>
            <tbody>
                {sortedData.map(d => (
                    <tr key={d[0].id}>
                        <td>
                            <a href={d[0].external_urls.spotify}>{d[0].name}</a>
                        </td>
                        <td>{msToMin(d[1])}</td>
                        <td>{d[2]}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default StatsTable;
