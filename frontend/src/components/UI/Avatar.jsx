import { useState } from 'react'
import { User } from 'react-feather'

export function Avatar({ src, alt, className = "w-10 h-10" }) {
  const [imageError, setImageError] = useState(false)

  if (!src || imageError) {
    return (
      <div className={`${className} bg-gray-100 rounded-full flex items-center justify-center`}>
        <User className="w-1/2 h-1/2 text-gray-400" />
      </div>
    )
  }

  return (
    <img 
      src={src}
      alt={alt}
      className={`${className} object-cover rounded-full`}
      onError={() => setImageError(true)}
    />
  )
} 