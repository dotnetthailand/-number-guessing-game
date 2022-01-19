// react-router-dom v6 change Switch to Routes
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StaticRouter } from "react-router-dom/server";
import GameForm from './GameForm';

type Props = {
  gameId: number;
}

export default function RouterComponent({ gameId }: Props) {
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
      <StaticRouter location={'/'}>
        {app}
      </StaticRouter>
    );
  }

  return (
    <BrowserRouter> {app}</BrowserRouter>
  );
};


