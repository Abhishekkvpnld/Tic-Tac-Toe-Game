import React, { useState } from 'react';
import './Square.css';
import { circleSvg, crossSvg } from "../assets/gameIcon";

const Square = ({ id, playingAs, setGameState, currentPlayer, setCurrentPlayer, finishedState, finishedArrayState, gameState, socket, currentElement }) => {

  const [icon, setIcon] = useState(null);

  const clickOnSquare = () => {

    if(playingAs !== currentPlayer){
      return;
    };

    if (finishedState) {
      return;
    };

    if (!icon) {
      if (currentPlayer === "circle") {
        setIcon(circleSvg);

      } else {
        setIcon(crossSvg);
      };

      const myCurrentPlayer = currentPlayer;
      socket.emit("PlayerMoveFromClient", {
        state: {
          id,
          sign: currentPlayer
        }
      });

      setCurrentPlayer(currentPlayer === "circle" ? "cross" : "circle");


      setGameState(prev => {
        let newState = [...prev];
        const rowIndex = Math.floor(id / 3);
        const colIndex = id % 3;
        newState[rowIndex][colIndex] = myCurrentPlayer;
        return newState;
      });

    };
  };

  return (
    <div onClick={clickOnSquare}
      className={`square ${finishedState ? "not-allowed" : ''} 
      ${finishedArrayState.includes(id) ? finishedState + "-won" : ''} 
       ${currentPlayer !== playingAs ? "not-allowed" : ''}
       ${finishedState && finishedState !== playingAs ? "grey-background" : "" }
       `}>
      {currentElement === "circle" ? circleSvg : currentElement === "cross" ? crossSvg : icon}
    </div>
  )
}

export default Square;