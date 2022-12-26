import { HistoryApiEntry } from '@/types/spotifyApi';
import { RootState } from './store';

export const selectPureHistory = (state: RootState) =>
    state.state.history.filter(e => !e.gap) as HistoryApiEntry[];

export const selectLastBackupEntry = (state: RootState) =>
    ((state.state.backupFile?.history ?? []).filter(e => !e.gap) as HistoryApiEntry[]).at(0);
