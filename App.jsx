import React from 'react'
import Die from './Die'
import { nanoid } from 'nanoid'



export default function App() {
    
const [dice, setDice] = React.useState(genNewDice())
const [tenzies, setTenzies] = React.useState(false)
const [rolls, setRolls] = React.useState(0)
const [highScore, setHighScore] = React.useState([])
const [time, setTime] = React.useState(0)
const [timerOn, setTimerOn] = React.useState(false)
let singleHS = Math.min(...highScore)

function startTime() {
    setTimerOn(true)
}



React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
        setTenzies(true)
        setTimerOn(false)
        // setTime(0)
    } 
}, [dice])


React.useEffect(() => {
    let interval = null;
    
    if (timerOn) {
        interval = setInterval(() => {
            setTime(prevTime => prevTime + 10)
        }, 10)
    } else {
        clearInterval(interval)
    }
    return () => clearInterval(interval)
}, [timerOn])


function rollNewDice() { //helper function
    return {
            value: Math.ceil(Math.random() * 6), 
            isHeld: false,
            id: nanoid()
            }
            
}    

// Generates whole new set of die on app load and new game
function genNewDice() {
    const diceArray = []
    for (let i = 0; i < 10; i++) {
        diceArray.push(rollNewDice())
    }
    return diceArray
}

// checks conditions and holds die
function holdDie(id) {
    setDice(prevDice => prevDice.map(die => {
        return die.id === id ? {...die, isHeld: !die.isHeld} :
        die
    }))
}

//each die on the screen
const dieElements = dice.map(die => (
    <Die 
        key={die.id} 
        value={die.value} 
        isHeld={die.isHeld} 
        holdDie={() => holdDie(die.id)}
    />
    ))   
    


 
 

function rollDice() {
    if (!tenzies) {
        setDice(prevDice => prevDice.map(die => {
            return die.isHeld ?
                die : 
                rollNewDice() })
        ), 
                setRolls(prevRolls => prevRolls + 1)
                // setTimerOn(true)
    }   else {
            setTenzies(false)
            setTime(0)
            setDice(genNewDice())
            setHighScore(prevRolls => {
               return [...prevRolls, rolls]
            })
            setRolls(0)
    }}
    
    
        

  return (
    <main>
        <div className="timer-container">
            <span>{(("0" + Math.floor((time / 60000) % 60))).slice(-2)}:</span>
            <span>{(("0" + Math.floor((time / 1000) % 60))).slice(-2)}:</span>
            <span>{(("0" + (time / 10) % 100)).slice(-2)}</span>
        </div>
        <div className="text-container">
            <h1>Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it
            at its current value between rolls.</p>
        </div>
        <div className="die-container" onClick={startTime}>
            {dieElements}
        </div>
        <div className="bottom-container">
            <div className="score-roll-container">
                <div className="rolls">Rolls: {rolls}</div>
                <div className="high-score">High Score: {highScore.length >= 1 && singleHS }</div>
            </div>
            <button onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
        </div>
    </main>
  )
}
