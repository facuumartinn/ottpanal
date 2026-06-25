import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CreatePost } from '@/components/feed/CreatePost'
import { PostCard } from '@/components/feed/PostCard'
import { redirect } from 'next/navigation'

export default async function FeedPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Get posts from connections and user's own posts
  const posts = await prisma.post.findMany({
    include: {
      user: {
        include: {
          profile: true,
        },
      },
      likes: true,
      comments: {
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      shares: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
  })

  return (
    <div className="max-w-3xl mx-auto">
      {/* Create Post */}
      <CreatePost user={session.user} />

      {/* Posts Feed */}
      <div className="mt-6 space-y-4">
        {posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              ¡Bienvenido a OttPanal!
            </h3>
            <p className="text-gray-500">
              Sé el primero en publicar en El Panal. Comparte tu experiencia, conocimientos o una oferta de trabajo.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={{
                id: post.id,
                content: post.content,
                imageUrl: post.imageUrl,
                createdAt: post.createdAt,
                user: {
                  id: post.user.id,
                  name: post.user.profile
                    ? `${post.user.profile.firstName} ${post.user.profile.lastName}`
                    : post.user.email,
                  image: post.user.profile?.avatarUrl,
                  headline: post.user.profile?.headline,
                },
                likesCount: post.likes.length,
                commentsCount: post.comments.length,
                sharesCount: post.shares.length,
                likedByUser: post.likes.some((like) => like.userId === session.user.id),
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}
