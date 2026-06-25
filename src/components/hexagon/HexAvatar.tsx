'use client'

import Image from 'next/image'

interface HexAvatarProps {
  src?: string | null
  alt: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
}

export function HexAvatar({ src, alt, size = 'md', className = '' }: HexAvatarProps) {
  const sizeClass = sizeClasses[size]

  if (!src) {
    return (
      <div
        className={`${sizeClass} hex-clip bg-ott-honey flex items-center justify-center ${className}`}
      >
        <span className="text-white font-bold text-lg">
          {alt.charAt(0).toUpperCase()}
        </span>
      </div>
    )
  }

  return (
    <div className={`${sizeClass} hex-clip overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={size === 'sm' ? 40 : size === 'md' ? 64 : size === 'lg' ? 96 : 128}
        height={size === 'sm' ? 40 : size === 'md' ? 64 : size === 'lg' ? 96 : 128}
        className="w-full h-full object-cover"
      />
    </div>
  )
}
