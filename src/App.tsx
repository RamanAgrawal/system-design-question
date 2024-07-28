import  { FC } from 'react';
import DynamicGrid2dArray from './components/DynamicGrid2dArray';

interface AppProps {
  // add props here
}

const App: FC<AppProps> = () => {
  return (
    <div>
    <DynamicGrid2dArray/>
    </div>
  );
};

export default App;