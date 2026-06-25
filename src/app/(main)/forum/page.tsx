import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MessageSquare, Plus } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function ForumPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Get forum categories
  const categories = await prisma.forumCategory.findMany({
    include: {
      career: true,
      _count: {
        select: {
          threads: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  // Get recent threads
  const recentThreads = await prisma.forumThread.findMany({
    include: {
      category: true,
      user: {
        include: {
          profile: true,
        },
      },
      _count: {
        select: {
          replies: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-ott-orange to-ott-honey rounded-xl shadow p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Foros</h1>
            <p className="text-white/90">
              Discute, comparte conocimientos y conecta con tu comunidad
            </p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white text-ott-orange rounded-full font-medium hover:bg-white/90 transition">
            <Plus className="w-5 h-5" />
            <span>Nuevo tema</span>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <MessageSquare className="w-6 h-6 mr-2 text-ott-orange" />
          Categorías
        </h2>
        {categories.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay categorías de foro disponibles.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/forum/${category.id}`}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
              >
                <h3 className="font-semibold text-gray-900 mb-1">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm text-gray-500 mb-2">{category.description}</p>
                )}
                {category.career && (
                  <span className="inline-block px-2 py-1 bg-ott-cyan/10 text-ott-cyan rounded text-xs">
                    {category.career.name}
                  </span>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {category._count.threads} temas
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Threads */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Temas recientes
        </h2>
        {recentThreads.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay temas de discusión aún. ¡Sé el primero en crear uno!
          </p>
        ) : (
          <div className="space-y-4">
            {recentThreads.map((thread) => (
              <Link
                key={thread.id}
                href={`/forum/thread/${thread.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {thread.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {thread.content}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>
                        Por: {thread.user.profile?.firstName} {thread.user.profile?.lastName}
                      </span>
                      <span>{thread.category.name}</span>
                      <span>{thread._count.replies} respuestas</span>
                    </div>
                  </div>
                  {thread.pinned && (
                    <span className="px-2 py-1 bg-ott-honey/20 text-ott-honey rounded text-xs font-medium">
                      Fijado
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
