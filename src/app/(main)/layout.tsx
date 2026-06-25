import { auth } from '@/lib/auth'
import { Navbar } from '@/components/layout/Navbar'
import { redirect } from 'next/navigation'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }}
      />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
