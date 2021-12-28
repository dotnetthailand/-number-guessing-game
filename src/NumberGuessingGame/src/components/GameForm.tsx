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
  const [guessedNumber, setGuessedNumber] = useState(0);

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
    setTimeout(() => getLogInStatus(), 2000);

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
      alert(error.response.data);
    }
  };

  const handleGuessedNumberChanged = async (event: ChangeEvent<HTMLInputElement>) => {
    setGuessedNumber(Number.parseInt(event.currentTarget.value))
  }

  // https://fontawesome.com/v5.15/how-to-use/on-the-web/using-with/react
  return (
    <>
      {isLoading
        ? <div>Loading the game...</div>
        :
        <div>
          {
            isLogIn
              ?
              <form onSubmit={handleGuessedNumberSubmit}>
                <input type="text" name="GuessedNumber" placeholder='Put your guessed number' onChange={handleGuessedNumberChanged} maxLength={2} />
                <button type="submit">Guess 2 digits number</button>
              </form>
              :
              <div>
                <FontAwesomeIcon icon={faFacebook} size='2x' color='#1198F6' />
                <Button onClick={handleOnClick}>
                  Log in with Facebook to play a game
                </Button>
              </div>
          }
        </div>
      }
    </>
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


async function play(userId: number, gameId: number, guessNumber: number) {
  const client = axios.create();
  const params = new URLSearchParams();
  params.append('UserId', userId.toString());
  params.append('GameId', gameId.toString());
  params.append('GuessedNumber', guessNumber.toString());
  const url = '/game/play';
  await client.post(url, params);
}
