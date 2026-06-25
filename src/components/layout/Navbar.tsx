'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { HexAvatar } from '@/components/hexagon/HexAvatar'
import { Home, Users, Briefcase, MessageSquare, Bell, Search } from 'lucide-react'

interface NavbarProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

const navItems = [
  { href: '/feed', label: 'El Panal', icon: Home },
  { href: '/network', label: 'Red', icon: Users },
  { href: '/jobs', label: 'Empleos', icon: Briefcase },
  { href: '/messaging', label: 'Mensajes', icon: MessageSquare },
  { href: '/notifications', label: 'Notificaciones', icon: Bell },
]

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()

  return (
    <nav className="bg-ott-blue text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/feed" className="flex items-center space-x-2">
            <div className="w-8 h-8 hex-clip bg-ott-honey flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <span className="text-xl font-bold">OttPanal</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar en OttPanal..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-ott-honey"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center px-3 py-2 rounded-lg transition ${
                    isActive
                      ? 'bg-white/20 text-ott-honey'
                      : 'hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4 ml-4">
            <Link href={`/profile/${user?.email}`}>
              <HexAvatar src={user?.image} alt={user?.name || 'User'} size="sm" />
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-sm text-gray-300 hover:text-white transition"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
