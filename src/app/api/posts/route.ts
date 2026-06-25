import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createPostSchema = z.object({
  content: z.string().min(1, 'El contenido es requerido').max(5000, 'Contenido demasiado largo'),
  imageUrl: z.string().url().optional(),
})

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createPostSchema.parse(body)

    const post = await prisma.post.create({
      data: {
        userId: session.user.id,
        content: validatedData.content,
        imageUrl: validatedData.imageUrl,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Create post error:', error)
    return NextResponse.json(
      { error: 'Error al crear la publicación' },
      { status: 500 }
    )
  }
}
