import React, { useEffect, useState } from 'react';
import "./App.css";
import Square from './square/Square';
import { io } from "socket.io-client";
import Swal from "sweetalert2";



const renderFrom = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

const URL = 'http://localhost:3000';
// const URL = "https://tic-tac-toe-game-oetv.onrender.com";


const App = () => {

  const [gameState, setGameState] = useState(renderFrom);
  const [currentPlayer, setCurrentPlayer] = useState("circle");
  const [finishedState, setFinishedState] = useState(false);
  const [finishedArrayState, setFinishedArrayState] = useState([]);
  const [playOnline, setPlayOnline] = useState(false);
  const [socket, setSocket] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [opponentName, setOpponentName] = useState(null);
  const [playingAs, setPlayingAs] = useState(null);



  useEffect(() => {
    const winner = checkWinner();
    if (winner) {
      setFinishedState(winner);
    }
  }, [gameState]);



  const takePlayerName = async () => {
    const result = await Swal.fire({
      title: "Enter your Name",
      input: "text",
      inputLabel: "Type Your Name Here",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      }
    });
    return result;
  };



  socket?.on("OpponentLeftMatch", (data) => {
    alert("opponent left the match")
    setFinishedState("OpponentLeftMatch")
  });


  socket?.on("PlayerMoveFromServer", (data) => {
    const id = data.state.id;
    setGameState((prev) => {
      let newState = [...prev];
      const rowIndex = Math.floor(id / 3);
      const colIndex = id % 3;
      newState[rowIndex][colIndex] = data.state.sign;
      return newState;
    });
    setCurrentPlayer(data.state.sign === "circle" ? "cross" : "circle");
  });



  socket?.on("connect", () => {
    setPlayOnline(true)
  });



  socket?.on("OpponentNotFound", () => {
    setOpponentName(false);
  });



  socket?.on("OpponentFound", (data) => {
    setPlayingAs(data.playingAs);
    setOpponentName(data.opponentName);
  });



  const playOnlineClick = async () => {
    const result = await takePlayerName();

    if (!result.isConfirmed) {
      return
    };

    const playerName = result.value;
    setPlayerName(playerName);

    const newSocket = io(URL, {
      autoConnect: true
    });

    newSocket?.emit("request_to_play", {
      playerName: playerName
    });
    setSocket(newSocket);
  };

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


  if (!playOnline) {
    return <div className='main-div'>
      <button onClick={playOnlineClick} className='play-online'>Play Online</button>
    </div>
  };


  if (playOnline && !opponentName) {
    return (
      <div className='waiting'>
        <p>Waiting for opponent...</p>
        <div className='loader'></div>
      </div>
    )
  };


  return (

    <div className='main-div'>

      <div>

        <div className='move-detection'>
          <div className={`left ${currentPlayer === playingAs ? "current-move-" + currentPlayer : ''}`}>{playerName}</div>
          <div className={`right ${currentPlayer !== playingAs ? "current-move-" + currentPlayer : ''}`}>{opponentName}</div>
        </div>

        <h1 className='water-background game-heading'>Tic Tac Toe</h1>

        <div className='square-wrapper'>
          {
            gameState.map((arr, rowIndex) =>
              arr.map((i, colIndex) =>
                <Square
                  socket={socket}
                  playingAs={playingAs}
                  gameState={gameState}
                  finishedArrayState={finishedArrayState}
                  finishedState={finishedState}
                  currentPlayer={currentPlayer}
                  setCurrentPlayer={setCurrentPlayer}
                  setGameState={setGameState}
                  id={rowIndex * 3 + colIndex}
                  key={rowIndex * 3 + colIndex}
                  currentElement={i}
                />)
            )
          }
        </div>
        {
          finishedState && finishedState !== "OpponentLeftMatch" && finishedState !== "draw" &&
          <h2 className='finished-state'>{finishedState === playingAs ? "You" : finishedState} won the game</h2>
        }

        {
          finishedState && finishedState !== "OpponentLeftMatch" && finishedState === "draw" &&
          <h2 className='finished-state'>Draw Game</h2>
        }
        {
          !finishedState && opponentName &&
          <h2 className='finished-state'>You are playing against {opponentName}</h2>
        }
        {
          !finishedState && finishedState === "OpponentLeftMatch" &&
          <h2 className='finished-state'>You won the game, Opponent has left</h2>
        }
      </div>

    </div>

  )
};

export default App;