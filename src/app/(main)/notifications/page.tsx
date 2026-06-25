import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Bell, ThumbsUp, MessageCircle, Share2, UserPlus, Briefcase } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { redirect } from 'next/navigation'

export default async function NotificationsPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Get user's notifications
  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  })

  const notificationIcons = {
    LIKE: ThumbsUp,
    COMMENT: MessageCircle,
    SHARE: Share2,
    CONNECTION_REQUEST: UserPlus,
    CONNECTION_ACCEPTED: UserPlus,
    MESSAGE: MessageCircle,
    JOB_APPLICATION: Briefcase,
    MENTION: MessageCircle,
  }

  const notificationColors = {
    LIKE: 'text-ott-blue',
    COMMENT: 'text-ott-cyan',
    SHARE: 'text-ott-honey',
    CONNECTION_REQUEST: 'text-ott-orange',
    CONNECTION_ACCEPTED: 'text-green-500',
    MESSAGE: 'text-ott-cyan',
    JOB_APPLICATION: 'text-ott-blue',
    MENTION: 'text-ott-orange',
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Bell className="w-6 h-6 mr-2 text-ott-blue" />
            Notificaciones
            {unreadCount > 0 && (
              <span className="ml-2 px-3 py-1 bg-ott-honey text-white rounded-full text-sm">
                {unreadCount} nuevas
              </span>
            )}
          </h1>
          {unreadCount > 0 && (
            <button className="text-sm text-ott-blue hover:underline">
              Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No tienes notificaciones
          </h3>
          <p className="text-gray-500">
            Cuando alguien interactúe con tu contenido, lo verás aquí.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow divide-y divide-gray-200">
          {notifications.map((notification) => {
            const Icon = notificationIcons[notification.type] || Bell
            const colorClass = notificationColors[notification.type] || 'text-gray-500'

            return (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition ${
                  !notification.read ? 'bg-blue-50/50' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">
                      {notification.type === 'LIKE' && 'A alguien le gustó tu publicación'}
                      {notification.type === 'COMMENT' && 'Alguien comentó tu publicación'}
                      {notification.type === 'SHARE' && 'Alguien polinizó tu publicación'}
                      {notification.type === 'CONNECTION_REQUEST' && 'Tienes una nueva solicitud de conexión'}
                      {notification.type === 'CONNECTION_ACCEPTED' && 'Tu solicitud de conexión fue aceptada'}
                      {notification.type === 'MESSAGE' && 'Tienes un nuevo mensaje'}
                      {notification.type === 'JOB_APPLICATION' && 'Nueva aplicación a tu oferta de empleo'}
                      {notification.type === 'MENTION' && 'Alguien te mencionó'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-ott-blue rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
