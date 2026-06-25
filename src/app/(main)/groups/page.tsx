import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Users, Plus, Lock, Globe } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function GroupsPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Get user's groups
  const userGroups = await prisma.group.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      _count: {
        select: {
          members: true,
          posts: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  // Get all public groups
  const publicGroups = await prisma.group.findMany({
    where: {
      privacy: 'PUBLIC',
    },
    include: {
      career: true,
      _count: {
        select: {
          members: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
    take: 20,
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-ott-cyan to-ott-blue rounded-xl shadow p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Grupos</h1>
            <p className="text-white/90">
              Conecta con profesionales de tu área e intereses
            </p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white text-ott-blue rounded-full font-medium hover:bg-white/90 transition">
            <Plus className="w-5 h-5" />
            <span>Crear grupo</span>
          </button>
        </div>
      </div>

      {/* My Groups */}
      {userGroups.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Users className="w-6 h-6 mr-2 text-ott-cyan" />
            Mis Grupos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userGroups.map((group) => (
              <Link
                key={group.id}
                href={`/groups/${group.id}`}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{group.name}</h3>
                  {group.privacy === 'PRIVATE' ? (
                    <Lock className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Globe className="w-4 h-4 text-ott-cyan" />
                  )}
                </div>
                {group.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {group.description}
                  </p>
                )}
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <span>{group._count.members} miembros</span>
                  <span>{group._count.posts} publicaciones</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Discover Groups */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Descubrir grupos
        </h2>
        {publicGroups.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay grupos públicos disponibles.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publicGroups.map((group) => {
              const isMember = userGroups.some((g) => g.id === group.id)
              return (
                <div
                  key={group.id}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{group.name}</h3>
                    <Globe className="w-4 h-4 text-ott-cyan" />
                  </div>
                  {group.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {group.description}
                    </p>
                  )}
                  {group.career && (
                    <span className="inline-block px-2 py-1 bg-ott-cyan/10 text-ott-cyan rounded text-xs mb-3">
                      {group.career.name}
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {group._count.members} miembros
                    </span>
                    {!isMember && (
                      <button className="px-3 py-1 bg-ott-blue text-white rounded-full text-xs font-medium hover:bg-ott-blue/90 transition">
                        Unirse
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
