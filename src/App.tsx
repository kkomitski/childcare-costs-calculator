import { useQueryState } from 'nuqs';
import Standard from './calculators/standard';
import TermTimeOnly from './calculators/term-time-only';

const App = () => {
  const [activeCalculator, setActiveCalculator] = useQueryState('calculator', {
    defaultValue: 'standard',
    parse: (value) => (value === 'term-time' ? 'term-time' : 'standard'),
  });

  if (activeCalculator === 'term-time') {
    return <TermTimeOnly onToggle={() => setActiveCalculator('standard')} />;
  }

  return <Standard onToggle={() => setActiveCalculator('term-time')} />;
};

export default App;
