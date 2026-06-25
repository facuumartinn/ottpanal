import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { HexAvatar } from '@/components/hexagon/HexAvatar'
import { UserPlus, Users, Check, X } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function NetworkPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Get pending connection requests
  const pendingRequests = await prisma.connection.findMany({
    where: {
      receiverId: session.user.id,
      status: 'PENDING',
    },
    include: {
      requester: {
        include: {
          profile: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Get connections
  const connections = await prisma.connection.findMany({
    where: {
      OR: [
        { requesterId: session.user.id, status: 'ACCEPTED' },
        { receiverId: session.user.id, status: 'ACCEPTED' },
      ],
    },
    include: {
      requester: {
        include: {
          profile: true,
        },
      },
      receiver: {
        include: {
          profile: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  // Get suggested connections (users in same career)
  const userWithProfile = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
    },
  })

  let suggestions: any[] = []
  if (userWithProfile?.profile?.careerId) {
    suggestions = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: session.user.id } },
          {
            profile: {
              careerId: userWithProfile.profile.careerId,
            },
          },
        ],
      },
      include: {
        profile: true,
      },
      take: 10,
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <UserPlus className="w-6 h-6 mr-2 text-ott-blue" />
            Solicitudes de conexión ({pendingRequests.length})
          </h2>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <HexAvatar
                    src={request.requester.profile?.avatarUrl}
                    alt={`${request.requester.profile?.firstName} ${request.requester.profile?.lastName}`}
                    size="md"
                  />
                  <div>
                    <Link
                      href={`/profile/${request.requester.id}`}
                      className="font-semibold text-gray-900 hover:text-ott-blue"
                    >
                      {request.requester.profile?.firstName} {request.requester.profile?.lastName}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {request.requester.profile?.headline || request.requester.email}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 bg-ott-blue text-white rounded-full hover:bg-ott-blue/90 transition">
                    <Check className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Connections */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2 text-ott-cyan" />
          Mis Conexiones ({connections.length})
        </h2>
        {connections.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Aún no tienes conexiones. Explora la red para conectar con otros profesionales.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connections.map((conn) => {
              const otherUser = conn.requesterId === session.user.id ? conn.receiver : conn.requester
              return (
                <Link
                  key={conn.id}
                  href={`/profile/${otherUser.id}`}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                >
                  <HexAvatar
                    src={otherUser.profile?.avatarUrl}
                    alt={`${otherUser.profile?.firstName} ${otherUser.profile?.lastName}`}
                    size="md"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {otherUser.profile?.firstName} {otherUser.profile?.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {otherUser.profile?.headline || otherUser.email}
                    </p>
                    {otherUser.profile?.career && (
                      <p className="text-xs text-ott-blue mt-1">
                        {otherUser.profile.career.name}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Sugerencias de conexión
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <HexAvatar
                    src={user.profile?.avatarUrl}
                    alt={`${user.profile?.firstName} ${user.profile?.lastName}`}
                    size="md"
                  />
                  <div>
                    <Link
                      href={`/profile/${user.id}`}
                      className="font-semibold text-gray-900 hover:text-ott-blue"
                    >
                      {user.profile?.firstName} {user.profile?.lastName}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {user.profile?.headline || user.email}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-ott-blue text-white rounded-full text-sm font-medium hover:bg-ott-blue/90 transition">
                  Conectar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
