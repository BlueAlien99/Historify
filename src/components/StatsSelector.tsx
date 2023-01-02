import { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import HistoryStats from './HistoryStats';
import RecentlyPlayedStats from './RecentlyPlayedStats';

interface Props {
    aggregationLevel: 'year' | 'month';
}

function StatsSelector({ aggregationLevel }: Props) {
    const history = useAppSelector(state => state.state.history);
    const recentlyPlayed = useAppSelector(state => state.state.recentlyPlayed);

    const [selectValue, setSelectValue] = useState('0');

    const options = [
        ...new Set(history.map(e => e.endTime.substring(0, aggregationLevel === 'month' ? 7 : 4))),
    ]
        .sort()
        .reverse();

    const handleChange: React.ChangeEventHandler<HTMLSelectElement> = e => {
        setSelectValue(e.target.value);
    };

    const filterAggregation = () => history.filter(e => e.endTime.startsWith(selectValue));

    const filterRecent = () => {
        const d = new Date();

        let threshold = d.toISOString();
        if (aggregationLevel === 'month') {
            d.setDate(1);
            d.setMonth(d.getMonth() - 1);
            threshold = `${d.toISOString().substring(0, 7)}${threshold.substring(7)}`;
        } else if (aggregationLevel === 'year') {
            threshold = `${d.getFullYear() - 1}${threshold.substring(4)}`;
        }

        return history.filter(e => e.endTime > threshold);
    };

    const getHistoryRange = () => (selectValue === '0' ? filterRecent() : filterAggregation());

    return (
        <div id="stats-col">
            <select value={selectValue} onChange={handleChange}>
                <option value="-1">Recently played</option>
                <option value="0">Last {aggregationLevel} (history)</option>
                {options.map(opt => (
                    <option value={opt} key={opt}>
                        {opt}
                    </option>
                ))}
            </select>
            {selectValue === '-1' ? (
                <RecentlyPlayedStats data={recentlyPlayed} />
            ) : (
                <HistoryStats data={getHistoryRange()} />
            )}
        </div>
    );
}

export default StatsSelector;
