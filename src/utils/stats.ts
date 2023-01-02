/* eslint-disable @typescript-eslint/ban-ts-comment */

import { SortConfig } from '@/redux/stateSlice';

const compareStringsWithOrder = (a: string, b: string, asc: boolean) =>
    a.localeCompare(b) * (asc ? 1 : -1);

const getSortableString = (data: unknown): string => {
    if (typeof data === 'string') {
        return data;
    }

    if (typeof data === 'object' && data) {
        if ('name' in data && typeof data.name === 'string') {
            return data.name;
        }

        if ('trackName' in data && typeof data.trackName === 'string') {
            return data.trackName;
        }
    }

    throw Error(`Unsupported data type: ${JSON.stringify(data)}`);
};

// TODO: ...
export const sort = <T extends Array<readonly unknown[]>>(data: T, { col, asc }: SortConfig): T => {
    if (data.length === 0 || col >= data[0].length) {
        return data;
    }

    if (typeof data[0][col] === 'number') {
        // @ts-ignore
        return [...data].sort((a, b) => (asc ? a[col] - b[col] : b[col] - a[col]));
    }

    // @ts-ignore
    return [...data].sort((a, b) =>
        compareStringsWithOrder(getSortableString(a[col]), getSortableString(b[col]), asc)
    );
};

export const getSortMark = (col: number, config: SortConfig) => {
    if (col !== config.col) {
        return '';
    }

    return config.asc ? '⬆️' : '⬇️';
};
