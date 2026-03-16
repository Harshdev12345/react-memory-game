import React, { useState, useEffect } from "react";
import "./App.css";

const emojis = ["🐶","🐱","🐸","🐼","🦊","🐵","🐰","🐻"];

function shuffleCards() {
  return [...emojis, ...emojis]
    .map((emoji) => ({
      emoji,
      id: Math.random(),
      flipped: false,
      matched: false
    }))
    .sort(() => Math.random() - 0.5);
}

function App() {

  const [cards, setCards] = useState(shuffleCards());
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  const bestScore = localStorage.getItem("bestScore");

  useEffect(() => {

    let timer;

    if(running){
      timer = setInterval(()=>{
        setTime(t => t + 1);
      },1000);
    }

    return ()=>clearInterval(timer);

  },[running]);

  function handleClick(index){

    if(cards[index].flipped || cards[index].matched || flipped.length === 2){
      return;
    }

    if(!running) setRunning(true);

    const newCards = [...cards];
    newCards[index].flipped = true;

    const newFlipped = [...flipped, index];

    setCards(newCards);
    setFlipped(newFlipped);

    if(newFlipped.length === 2){

      setMoves(m => m + 1);

      const [first, second] = newFlipped;

      if(newCards[first].emoji === newCards[second].emoji){

        newCards[first].matched = true;
        newCards[second].matched = true;

        setCards(newCards);
        setFlipped([]);

      } else {

        setTimeout(()=>{

          newCards[first].flipped = false;
          newCards[second].flipped = false;

          setCards([...newCards]);
          setFlipped([]);

        },800)

      }

    }

  }

  const won = cards.every(card => card.matched);

  useEffect(()=>{

    if(won){
      setRunning(false);

      if(!bestScore || moves < bestScore){
        localStorage.setItem("bestScore", moves);
      }
    }

  },[won,moves,bestScore])

  function restartGame(){

    setCards(shuffleCards());
    setFlipped([]);
    setMoves(0);
    setTime(0);
    setRunning(false);

  }

  return (

    <div className="container">

      <h1>Memory Card Game</h1>

      <div className="stats">

        <p>Moves: {moves}</p>
        <p>Time: {time}s</p>
        <p>Best Score: {bestScore || "—"}</p>

      </div>

      {won && <h2 className="win">You Won 🎉</h2>}

      <button onClick={restartGame}>Restart</button>

      <div className="grid">

        {cards.map((card,index)=>(
          <div
            key={card.id}
            className={`card ${card.flipped || card.matched ? "flipped" : ""} ${card.matched ? "matched" : ""}`}
            onClick={()=>handleClick(index)}
          >
            <div className="inner">

              <div className="front">
                {card.emoji}
              </div>

              <div className="back">
                ❓
              </div>

            </div>

          </div>
        ))}

      </div>

    </div>

  );

}

export default App;