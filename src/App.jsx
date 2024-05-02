import React, { useEffect, useState } from 'react';
import "./App.css";
import Square from './square/Square';

const renderFrom = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

const App = () => {

  const [gameState, setGameState] = useState(renderFrom);
  const [currentPlayer, setCurrentPlayer] = useState("circle");
  const [finishedState, setFinishedState] = useState(false);
  const [finishedArrayState, setFinishedArrayState] = useState([]);
  const [playOnline, setPlayOnline] = useState(false);

  const checkWinner = () => {

    for (let row = 0; row < gameState.length; row++) {
      //row dynamic
      if (
        gameState[row][0] === gameState[row][1] &&
        gameState[row][1] === gameState[row][2]
      ) {
        setFinishedArrayState([row * 3 + 0, row * 3 + 1, row * 3 + 2]);
        return gameState[row][0]
      };
    };

    //column dynamic
    for (let col = 0; col < gameState.length; col++) {
      if (
        gameState[0][col] === gameState[1][col] &&
        gameState[1][col] === gameState[2][col]
      ) {
        setFinishedArrayState([0 * 3 + col, 1 * 3 + col, 2 * 3 + col])
        return gameState[0][col];
      };
    };

    //cross check
    if (gameState[0][0] === gameState[1][1] && gameState[1][1] === gameState[2][2]) {
      return gameState[0][0];
    };

    if (gameState[0][2] === gameState[1][1] && gameState[1][1] === gameState[2][0]) {
      return gameState[0][2];
    };

    const isDraw = gameState.flat().every((e) => {
      if (e === "circle" || e === "cross") return true
    });

    if (isDraw) return "draw"

    return null;
  };

  useEffect(() => {
    const winner = checkWinner();
    if (winner) {
      setFinishedState(winner);
    };
  }, [gameState]);


  if (!playOnline){
    return <div className='main-div'>
      <button className='play-online'>Play Online</button>
    </div>
  }

    return (

      <div className='main-div'>

        <div>

          <div className='move-detection'>
            <div className='left'>YourSelf</div>
            <div className='right'>Opponent</div>
          </div>

          <h1 className='water-background game-heading'>Tic Tac Toe</h1>

          <div className='square-wrapper'>
            {
              gameState.map((arr, rowIndex) =>
                arr.map((i, colIndex) =>
                  <Square
                    finishedArrayState={finishedArrayState}
                    finishedState={finishedState}
                    currentPlayer={currentPlayer}
                    setCurrentPlayer={setCurrentPlayer}
                    setGameState={setGameState}
                    id={rowIndex * 3 + colIndex}
                    key={rowIndex * 3 + colIndex}
                  />)
              )
            }
          </div>
          {
            finishedState && finishedState !== "draw" &&
            <h2 className='finished-state'>{finishedState} won the game</h2>
          }

          {
            finishedState && finishedState === "draw" &&
            <h2 className='finished-state'>Draw Game</h2>
          }
        </div>
      </div>
    )
};

export default App;