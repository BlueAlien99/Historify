import { BackupFile, backupFileLoaded } from '@/redux/stateSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchHistoryDetails } from '@/redux/stateThunks';

function FileInput() {
    const dispatch = useAppDispatch();

    const backupFilename = useAppSelector(state => state.state.backupFilename);

    const handleFileLoad = (filename: string) => (event: ProgressEvent<FileReader>) => {
        const rawData = event.target?.result;

        if (typeof rawData !== 'string') {
            return;
        }

        // TODO: unsafe
        const content = JSON.parse(rawData) as BackupFile['content'];
        dispatch(backupFileLoaded({ filename, content }));
        void dispatch(fetchHistoryDetails({ cacheOnly: true }));
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

    // TODO: upload status? e.g. if JSON.parse succeeded
    return (
        <div id="file-input">
            <label className="btn">
                <input type="file" accept=".json" onChange={handleChange} />
                Use backup / history
            </label>
            <div className="stats">
                <span>Filename: {backupFilename}</span>
            </div>
        </div>
    );
}

export default FileInput;
