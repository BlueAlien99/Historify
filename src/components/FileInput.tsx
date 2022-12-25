import { useMemo } from 'react';
import { backupFileLoaded } from '@/redux/stateSlice';
import { HistoryApiEntry, HistoryEntry } from '@/types/spotifyApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

function FileInput() {
    const dispatch = useAppDispatch();

    const backupFile = useAppSelector(state => state.state.backupFile);

    const pureHistory = useMemo(
        () => (backupFile?.history.filter(e => !e.gap) as HistoryApiEntry[]) ?? [],
        [backupFile]
    );

    const handleFileLoad = (filename: string) => (event: ProgressEvent<FileReader>) => {
        const rawData = event.target?.result;

        if (typeof rawData !== 'string') {
            return;
        }

        // TODO: unsafe
        const history = JSON.parse(rawData) as HistoryEntry[];
        dispatch(backupFileLoaded({ filename, history }));
    };

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = handleFileLoad(file.name);
        reader.readAsText(file, 'UTF-8');

        event.target.value = '';
    };

    return (
        <div id="file-input">
            <label className="btn">
                <input type="file" accept=".json" onChange={handleChange} />
                Use backup!
            </label>
            <div className="stats">
                <span>Filename: {backupFile?.filename}</span>
                <span>Gaps: {backupFile?.history.filter(e => e.gap).length ?? ''}</span>
                <span>Tracks: {pureHistory.length || ''}</span>
                <span>From: {pureHistory.at(0)?.played_at}</span>
                <span>To: {pureHistory.at(-1)?.played_at}</span>
            </div>
        </div>
    );
}

export default FileInput;
