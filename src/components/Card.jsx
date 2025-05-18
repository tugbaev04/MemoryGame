import React, { useState } from 'react'

function Card({ card, handleClick }) {
  const [imgError, setImgError] = useState(false)

  const handleImageError = () => {
    console.log("Image failed to load:", card.src)
    setImgError(true)
  }

  return (
    <div className={`card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}>
      <div className="card-inner">
        <div className="card-front"></div>
        <div className="card-back">
          {imgError ? (
            <div className="fallback-content">{card.name || '?'}</div>
          ) : (
            <img 
              src={card.src} 
              alt={card.name || 'card'} 
              onError={handleImageError} 
            />
          )}
        </div>
      </div>
      <div className="card-clickable" onClick={handleClick}></div>
    </div>
  )
}

export default Card
