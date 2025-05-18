import { useState, useEffect } from 'react'
import './App.css'
import Card from './components/Card'

function App() {
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [timer, setTimer] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  // Card images with emojis as fallback
  const cardImages = [
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", name: "React", matched: false },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", name: "JavaScript", matched: false },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", name: "HTML", matched: false },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", name: "CSS", matched: false },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", name: "Node.js", matched: false },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", name: "Git", matched: false },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg", name: "VS Code", matched: false },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", name: "GitHub", matched: false }
  ]

  // Start game function
  const startGame = () => {
    // Reset states
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setTimer(0)
    setGameOver(false)
    setGameStarted(true)
    
    // Create card pairs and randomize order
    const duplicatedCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, id: index, flipped: false }))
    
    setCards(duplicatedCards)
  }

  // Handle card selection
  const handleCardClick = (cardId) => {
    if (flippedCards.length === 2 || cards[cardId].flipped) return
    
    // Flip the selected card
    const updatedCards = cards.map(card => 
      card.id === cardId ? { ...card, flipped: true } : card
    )
    setCards(updatedCards)
    
    // Add to flipped cards
    setFlippedCards(prev => [...prev, cardId])
  }

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(prev => prev + 1)
      
      const [first, second] = flippedCards
      if (cards[first].src === cards[second].src) {
        // Match found
        const updatedCards = cards.map(card => 
          card.id === first || card.id === second 
            ? { ...card, matched: true } 
            : card
        )
        setCards(updatedCards)
        setMatchedPairs(prev => prev + 1)
        resetTurn()
      } else {
        // No match
        setTimeout(() => {
          const updatedCards = cards.map(card => 
            card.id === first || card.id === second 
              ? { ...card, flipped: false } 
              : card
          )
          setCards(updatedCards)
          resetTurn()
        }, 1000)
      }
    }
  }, [flippedCards, cards])

  // Check for game over
  useEffect(() => {
    if (matchedPairs === cardImages.length && gameStarted) {
      setGameOver(true)
      setGameStarted(false)
    }
  }, [matchedPairs, gameStarted])

  // Timer logic
  useEffect(() => {
    let interval
    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameStarted, gameOver])

  // Reset turn
  const resetTurn = () => {
    setFlippedCards([])
  }

  // Format time
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
  }

  // Start the game automatically
  useEffect(() => {
    startGame()
  }, [])

  return (
    <div className="app">
      <h1>Memory Match Game</h1>
      
      <div className="game-info">
        <div className="stats">
          <p>Time: {formatTime(timer)}</p>
          <p>Moves: {moves}</p>
          <p>Matches: {matchedPairs}/{cardImages.length}</p>
        </div>
        <button onClick={startGame} className="start-button">
          {gameStarted ? 'Restart Game' : 'Start Game'}
        </button>
      </div>

      {gameOver && (
        <div className="game-over">
          <h2>Congratulations!</h2>
          <p>You completed the game in {formatTime(timer)} with {moves} moves.</p>
        </div>
      )}

      <div className="card-grid">
        {cards.map(card => (
          <Card 
            key={card.id}
            card={card}
            handleClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default App
