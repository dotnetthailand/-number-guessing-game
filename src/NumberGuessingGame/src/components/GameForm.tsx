import React, { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from 'react';
import axios from 'axios';
import '../scss/style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { Button } from 'react-bootstrap';
import FacebookService from '../FacebookService';

type Props = {
  gameId: number;
};

const facebookService = new FacebookService();

export default function GameForm({ gameId }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogIn, setIsLogIn] = useState(false);
  const [userId, setUserId] = useState(0);
  const [guessedNumber, setGuessedNumber] = useState('');

  useEffect(() => {

    const getLogInStatus = async () => {
      const response = await facebookService.getLogInStatus();
      if (response.status !== 'connected') {
        setIsLoading(false)
        return;
      }
      const facebookAccessToken = response.authResponse.accessToken;
      const connectResponse = await connectUser(facebookAccessToken);
      setUserId(connectResponse.data.id);
      setIsLogIn(true);
      setIsLoading(false)
    };

    // Delay for FB SDK to be ready
    setTimeout(() => getLogInStatus(), 1100);

  }, []);

  const handleOnClick = async (event: MouseEvent<HTMLButtonElement>) => {
    try {
      event.preventDefault();

      const logInResponse = await facebookService.logIn();
      const authResponse = logInResponse.authResponse;
      const facebookAccessToken = authResponse.accessToken;
      const connectResponse = await connectUser(facebookAccessToken);
      setUserId(connectResponse.data.id);
      setIsLogIn(true);

    } catch (ex) {
      await facebookService.handleException(ex);
    }
  };

  const handleGuessedNumberSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      await play(userId, gameId, guessedNumber);
      alert("Thanks for playing the game with us");
      location.href = '/'; // Reload the page
    } catch (error: any) {
      alert(error.response.data.errorMessage);
    }
  };

  const handleGuessedNumberChanged = async (event: ChangeEvent<HTMLInputElement>) => {
    setGuessedNumber(event.currentTarget.value);
  }

  // https://fontawesome.com/v5.15/how-to-use/on-the-web/using-with/react
  return (
    <div className="main-container d-flex justify-content-center align-items-center mt-3">
      {isLoading
        ? <div className="loading-text">Loading the game...</div>
        :
        <div>
          {
            isLogIn
              ?
              <form onSubmit={handleGuessedNumberSubmit} className="game-form d-flex flex-column justify-content-center">
                <span className="header-game">Number Guessing Game</span>
                <input type="text" className="form-control input-guessedNumber rounded-pill" name="GuessedNumber" placeholder='Enter your guessed number' onChange={handleGuessedNumberChanged} maxLength={2} />
                <button className="btn rounded-pill btn-guess" type="submit">Guess 2 digits number</button>
              </form>
              :
              <div>
                <Button onClick={handleOnClick} className="d-flex flex-row align-items-center -gap-sm">
                  <FontAwesomeIcon icon={faFacebook} size='2x' color='#fff' />
                  Log in with Facebook to play a game
                </Button>
              </div>
          }
        </div>
      }
    </div>
  );
}

async function connectUser(facebookAccessToken: string) {
  const client = axios.create();
  const params = new URLSearchParams();
  params.append('facebookAccessToken', facebookAccessToken);
  const url = '/game/connect'; // URL is from custom route
  return await client.post<User>(url, params);
}

type User = {
  id: number;
};

async function play(userId: number, gameId: number, guessNumber: string) {
  const client = axios.create();
  const params = new URLSearchParams();
  params.append('UserId', userId.toString());
  params.append('GameId', gameId.toString());
  params.append('GuessedNumber', guessNumber);
  const url = '/game/play';
  await client.post(url, params);
}
