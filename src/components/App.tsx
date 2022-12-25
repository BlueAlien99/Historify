import Controls from './Controls';
import StatsSelector from './StatsSelector';

function App() {
    return (
        <div className="App">
            <Controls />
            <StatsSelector aggregationLevel="month" />
            <StatsSelector aggregationLevel="year" />
        </div>
    );
}

export default App;
