// react-router-dom v6 change Switch to Routes
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StaticRouter } from "react-router-dom/server";
import GameForm from './GameForm';
import { createStore, combineReducers } from "redux";
import CounterReducer from '../store/CounterReducer'
import { Provider } from 'react-redux';

// initial state 
// https://stackoverflow.com/questions/37823132/how-to-set-initial-state-in-redux

type Props = {
  gameId: number;
  count: number;
}

export default function RouterComponent({ gameId, count }: Props) {
  console.log('Router component get called');

  const store = createStore(
    combineReducers({
      CounterReducer
    }),
    { CounterReducer: { count: count } } // preloadedState override default state in each reducer function
  );

  // const location = useLocation();
  const app = (
    <div>
      <Routes>
        <Route path="/" element={<GameForm gameId={gameId} />} />
      </Routes>
    </div>
  );

  // Add server-side route resolution by deferring to React Router
  if (typeof window === 'undefined') {
    return (
      <Provider store={store}>
        <StaticRouter location={'/'}>
          {app}
        </StaticRouter>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <BrowserRouter> {app}</BrowserRouter>
    </Provider>
  );
};


