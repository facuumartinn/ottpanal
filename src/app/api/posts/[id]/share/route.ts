import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const shareSchema = z.object({
  content: z.string().max(500).optional(),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id: postId } = await params
    const body = await request.json()
    const validatedData = shareSchema.parse(body)

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json({ error: 'Publicación no encontrada' }, { status: 404 })
    }

    const share = await prisma.share.create({
      data: {
        postId,
        userId: session.user.id,
        content: validatedData.content,
      },
    })

    return NextResponse.json(share, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Share error:', error)
    return NextResponse.json(
      { error: 'Error al polinizar la publicación' },
      { status: 500 }
    )
  }
}
