'use client'

import { useState } from 'react'
import { HexAvatar } from '@/components/hexagon/HexAvatar'
import { ThumbsUp, MessageCircle, Share2, Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface PostCardProps {
  post: {
    id: string
    content: string
    imageUrl?: string | null
    createdAt: Date
    user: {
      id: string
      name: string
      image?: string | null
      headline?: string | null
    }
    likesCount: number
    commentsCount: number
    sharesCount: number
    likedByUser: boolean
  }
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.likedByUser)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [pollinating, setPollinating] = useState(false)

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
      })

      if (res.ok) {
        setLiked(!liked)
        setLikesCount(liked ? likesCount - 1 : likesCount + 1)
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handlePollinate = async () => {
    setPollinating(true)
    try {
      const res = await fetch(`/api/posts/${post.id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: '¡Polinizado!' }),
      })

      if (res.ok) {
        // Add animation
        setTimeout(() => setPollinating(false), 300)
      }
    } catch (error) {
      console.error('Error sharing post:', error)
      setPollinating(false)
    }
  }

  const handleComment = async () => {
    if (!comment.trim()) return

    try {
      const res = await fetch(`/api/posts/${post.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: comment }),
      })

      if (res.ok) {
        setComment('')
        window.location.reload()
      }
    } catch (error) {
      console.error('Error commenting:', error)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-start space-x-3">
        <HexAvatar src={post.user.image} alt={post.user.name} size="md" />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
          {post.user.headline && (
            <p className="text-sm text-gray-500">{post.user.headline}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: es })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div className="border-t border-b border-gray-100">
          <img
            src={post.imageUrl}
            alt="Post image"
            className="w-full max-h-96 object-cover"
          />
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-500 border-b border-gray-100">
        <div className="flex items-center space-x-1">
          <ThumbsUp className="w-4 h-4 text-ott-blue" />
          <span>{likesCount}</span>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:text-ott-blue transition"
          >
            {post.commentsCount} comentarios
          </button>
          <span>{post.sharesCount} polinizaciones</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-2 flex items-center justify-around border-b border-gray-100">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
            liked
              ? 'text-ott-blue bg-blue-50'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ThumbsUp className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
          <span className="font-medium">Me gusta</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">Comentar</span>
        </button>

        <button
          onClick={handlePollinate}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
            pollinating
              ? 'text-ott-honey bg-yellow-50 animate-pollinate'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Send className="w-5 h-5" />
          <span className="font-medium">Polinizar</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-4 bg-gray-50">
          <div className="flex space-x-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-ott-blue focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleComment()}
            />
            <button
              onClick={handleComment}
              disabled={!comment.trim()}
              className="px-4 py-2 bg-ott-blue text-white rounded-full font-medium hover:bg-ott-blue/90 transition disabled:opacity-50"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
