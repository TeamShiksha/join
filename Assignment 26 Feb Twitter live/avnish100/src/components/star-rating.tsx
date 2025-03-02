"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  onChange?: (rating: number) => void
  disabled?: boolean
}

export function StarRating({ rating, onChange, disabled = false }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const handleMouseEnter = (index: number) => {
    if (disabled || !onChange) return
    setHoverRating(index)
  }

  const handleMouseLeave = () => {
    if (disabled || !onChange) return
    setHoverRating(0)
  }

  const handleClick = (index: number) => {
    if (disabled || !onChange) return
    onChange(index)
  }

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((index) => {
        const filled = hoverRating ? index <= hoverRating : index <= Math.round(rating)
        const halfFilled = !filled && index <= Math.ceil(rating) && rating % 1 >= 0.5

        return (
          <span
            key={index}
            className={`cursor-${onChange && !disabled ? "pointer" : "default"}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
          >
            <Star
              className={`w-4 h-4 ${
                filled
                  ? "text-yellow-400 fill-yellow-400"
                  : halfFilled
                    ? "text-yellow-400 fill-yellow-400 half-filled"
                    : "text-gray-300"
              }`}
            />
          </span>
        )
      })}
    </div>
  )
}

