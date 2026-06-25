'use client'

import { HexAvatar } from '@/components/hexagon/HexAvatar'
import { MapPin, Briefcase, GraduationCap, Link as LinkIcon, Edit } from 'lucide-react'
import Link from 'next/link'

interface ProfileHeaderProps {
  profile: {
    firstName: string
    lastName: string
    headline?: string | null
    location?: string | null
    avatarUrl?: string | null
    bannerUrl?: string | null
    career?: {
      name: string
      faculty: {
        name: string
      }
    } | null
    currentCompany?: string | null
    website?: string | null
    linkedinUrl?: string | null
    graduationYear?: number | null
  }
  isOwnProfile: boolean
  userRole: string
}

export function ProfileHeader({ profile, isOwnProfile, userRole }: ProfileHeaderProps) {
  const fullName = `${profile.firstName} ${profile.lastName}`

  const roleLabels = {
    STUDENT: 'Alumno',
    ALUMNI: 'Alumni',
    COMPANY: 'Empresa',
    ADMIN: 'Administrador',
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      {/* Banner */}
      <div className="h-48 bg-gradient-to-r from-ott-blue via-ott-cyan to-ott-honey relative">
        {profile.bannerUrl && (
          <img
            src={profile.bannerUrl}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="flex items-end space-x-4 -mt-16">
          <div className="bg-white p-1 rounded-full">
            <HexAvatar
              src={profile.avatarUrl}
              alt={fullName}
              size="xl"
            />
          </div>
          <div className="flex-1 pb-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
                {profile.headline && (
                  <p className="text-lg text-gray-600 mt-1">{profile.headline}</p>
                )}
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  {profile.career && (
                    <span className="flex items-center">
                      <GraduationCap className="w-4 h-4 mr-1" />
                      {profile.career.name} - {profile.career.faculty.name}
                    </span>
                  )}
                  {profile.location && (
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {profile.location}
                    </span>
                  )}
                  {profile.currentCompany && (
                    <span className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {profile.currentCompany}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <span className="inline-block px-3 py-1 bg-ott-honey/20 text-ott-blue rounded-full text-sm font-medium">
                    {roleLabels[userRole as keyof typeof roleLabels] || userRole}
                  </span>
                  {profile.graduationYear && (
                    <span className="ml-2 text-sm text-gray-500">
                      Gradué {profile.graduationYear}
                    </span>
                  )}
                </div>
              </div>
              {isOwnProfile && (
                <Link
                  href={`/profile/${isOwnProfile ? 'edit' : ''}`}
                  className="flex items-center space-x-2 px-4 py-2 border-2 border-ott-blue text-ott-blue rounded-full font-medium hover:bg-ott-blue hover:text-white transition"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar perfil</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        {(profile.website || profile.linkedinUrl) && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center space-x-4">
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-ott-blue hover:underline"
              >
                <LinkIcon className="w-4 h-4" />
                <span className="text-sm">Sitio web</span>
              </a>
            )}
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-ott-blue hover:underline"
              >
                <LinkIcon className="w-4 h-4" />
                <span className="text-sm">LinkedIn</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
