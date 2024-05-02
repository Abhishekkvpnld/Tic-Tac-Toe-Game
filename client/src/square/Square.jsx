import React, { useState } from 'react';
import './Square.css';
import { circleSvg, crossSvg } from "../assets/gameIcon";

const Square = ({ id, setGameState, currentPlayer, setCurrentPlayer, finishedState, finishedArrayState }) => {

  const [icon, setIcon] = useState(null);

  const clickOnSquare = () => {
    if (!icon) {

      if (currentPlayer === "circle") {
        setIcon(circleSvg);

      } else {
        setIcon(crossSvg);
      };

      const myCurrentPlayer = currentPlayer;
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
    className={`square ${finishedState ? "not-allowed" : ''} ${finishedArrayState.includes(id) ? finishedState + "-won" : ''}`}>{icon}</div>
  )
}

export default Square;