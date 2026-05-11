import { useReducer } from 'react';
import { loadState, reducer } from './store.js';
import { isMobileDevice } from './utils.js';
import WebLayout from './layouts/WebLayout.jsx';
import MobileLayout from './layouts/MobileLayout.jsx';

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, loadState);
  return isMobileDevice
    ? <MobileLayout state={state} dispatch={dispatch} />
    : <WebLayout    state={state} dispatch={dispatch} />;
}
