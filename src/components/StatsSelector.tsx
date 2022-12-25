import { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { selectPureHistory } from '@/redux/stateSlice';
import Stats from './Stats';

interface Props {
    aggregationLevel: 'year' | 'month';
}

function StatsSelector({ aggregationLevel }: Props) {
    const history = useAppSelector(selectPureHistory);

    const [selectValue, setSelectValue] = useState('0');

    const options = [
        ...new Set(
            history.map(e => e.played_at.substring(0, aggregationLevel === 'month' ? 7 : 4))
        ),
    ].sort();

    const handleChange: React.ChangeEventHandler<HTMLSelectElement> = e => {
        setSelectValue(e.target.value);
    };

    const filterAggregation = () => history.filter(e => e.played_at.startsWith(selectValue));

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

        return history.filter(e => e.played_at > threshold);
    };

    const historyRange = selectValue === '0' ? filterRecent() : filterAggregation();

    return (
        <div id="stats-col">
            <select value={selectValue} onChange={handleChange}>
                <option value="0">Last {aggregationLevel}</option>
                {options.map(opt => (
                    <option value={opt} key={opt}>
                        {opt}
                    </option>
                ))}
            </select>
            <Stats history={historyRange} />
        </div>
    );
}

export default StatsSelector;
