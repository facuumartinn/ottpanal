import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const commentSchema = z.object({
  content: z.string().min(1, 'El comentario es requerido').max(1000, 'Comentario demasiado largo'),
  parentId: z.string().optional(),
})

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const postId = params.id
    const body = await request.json()
    const validatedData = commentSchema.parse(body)

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json({ error: 'Publicación no encontrada' }, { status: 404 })
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        userId: session.user.id,
        content: validatedData.content,
        parentId: validatedData.parentId,
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Comment error:', error)
    return NextResponse.json(
      { error: 'Error al crear el comentario' },
      { status: 500 }
    )
  }
}
