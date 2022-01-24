import './App.css';

import React, { useState, useEffect, useRef } from "react";
import Dice from "./components/Dice"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"
import Timer from './components/Timer'

export default function App() {

  //Dice and Game States:
  const [dice, setDice] = useState(allNewDice()) // set the dice
  const [tenzies, setTenzies] = useState(false) // user has won

  // Timer States: (**custom**)
  const [timer, setTimer] = useState(0);
  const [disable, setDisable] = useState(false) //disable Go button after one click (bug correction: if the user clicked again it went crazy, launchin new setIntervals with each click)
  const increment = useRef(null)

  // User has won, celebration
  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld) // check if every dice has been clicked

    // Not necessary because of my customized changes, but I keep it commented for future reference
    // const firstValue = dice[0].value // get the fist value to compare to the rest
    // const allSameValue = dice.every(die => die.value === firstValue) // compare to the rest
    //if (allHeld && allSameValue) { // if both conditions are true, the user has won

    if (allHeld) {
      setTenzies(true)
      clearInterval(increment.current)
    }
  }, [dice])

  // New value and properties for each die
  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6), //
      isHeld: false,
      id: nanoid()
    }
  }

  // New game, new numbers for all ten dice
  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice
  }


  // ROLL DICE
  function rollDice() {
    if (!tenzies) {
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ? // roll only the one's that are not held
          die :
          generateNewDie()
      }))
    } else {
      setTenzies(false)
      setDice(allNewDice())
      setTimer(0)
      setDisable(false)
    }
  }

  // HOLD SELECTED DICE ***CUSTOM CHANGE HERE***
  function holdDice(id, value) { // Custom change: You can only hold the same number that is already held
    const areAnyDiceHeld = dice.some(obj => obj.isHeld === true)
    if (areAnyDiceHeld) {
      const objIndex = dice.findIndex(obj => obj.isHeld === true)
      if (dice[objIndex].value === value) {
        setDice(oldDice => oldDice.map(die => {
          return die.id === id ? { ...die, isHeld: !die.isHeld } : die
        }))
      }
    } else {
      setDice(oldDice => oldDice.map(die => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die
      }))
    }

  }

  // SET THE DICE, and properties
  const diceElements = dice.map(die => (
    <Dice
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id, die.value)}
    />
  ))

  // ***CUSTOM CHANGE*** Timer and alert with final time
  function playTimer() {
    setDisable(true)
    increment.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1)
    }, 1000)    
  }


  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same.
        Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
        {diceElements}
      </div>
      <button
        className="roll-dice"
        onClick={rollDice}
      >
        {tenzies ? "New game" : "Roll"}
      </button>
      <Timer handleClick={playTimer} Timer={timer} disableButton={disable}></Timer>
    </main>
  )
}
