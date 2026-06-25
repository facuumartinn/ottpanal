import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MessageSquare, Send } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function MessagingPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Get user's conversations
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      },
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="w-6 h-6 mr-2 text-ott-blue" />
            Mensajes
          </h1>
        </div>

        {conversations.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No tienes conversaciones aún
            </h3>
            <p className="text-gray-500">
              Conecta con otros profesionales y empieza a chatear.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {conversations.map((conversation) => {
              const otherParticipant = conversation.participants.find(
                (p) => p.userId !== session.user.id
              )
              const lastMessage = conversation.messages[0]

              if (!otherParticipant) return null

              return (
                <div
                  key={conversation.id}
                  className="p-4 hover:bg-gray-50 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {otherParticipant.user.profile?.avatarUrl ? (
                        <img
                          src={otherParticipant.user.profile.avatarUrl}
                          alt={otherParticipant.user.profile.firstName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-ott-honey rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {otherParticipant.user.profile?.firstName?.charAt(0) || '?'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {otherParticipant.user.profile?.firstName}{' '}
                          {otherParticipant.user.profile?.lastName}
                        </h3>
                        {lastMessage && (
                          <span className="text-xs text-gray-500">
                            {new Date(lastMessage.createdAt).toLocaleDateString('es-ES')}
                          </span>
                        )}
                      </div>
                      {lastMessage && (
                        <p className="text-sm text-gray-500 truncate">
                          {lastMessage.content}
                        </p>
                      )}
                    </div>
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
