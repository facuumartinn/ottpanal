'use client'

import { useState } from 'react'
import { HexAvatar } from '@/components/hexagon/HexAvatar'
import { Image, Video, Calendar, Briefcase } from 'lucide-react'

interface CreatePostProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function CreatePost({ user }: CreatePostProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (res.ok) {
        setContent('')
        window.location.reload()
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex space-x-3">
        <HexAvatar src={user.image} alt={user.name || 'User'} size="md" />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="¿Qué quieres compartir con tu red?"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ott-blue focus:border-transparent resize-none"
            rows={3}
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex space-x-2">
              <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <Image className="w-5 h-5 text-ott-cyan" />
                <span className="text-sm">Foto</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <Video className="w-5 h-5 text-ott-orange" />
                <span className="text-sm">Video</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <Calendar className="w-5 h-5 text-ott-olive" />
                <span className="text-sm">Evento</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <Briefcase className="w-5 h-5 text-ott-honey" />
                <span className="text-sm">Empleo</span>
              </button>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || loading}
              className="px-6 py-2 bg-ott-blue text-white rounded-full font-semibold hover:bg-ott-blue/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
