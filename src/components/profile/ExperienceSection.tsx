'use client'

import { Briefcase, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface ExperienceSectionProps {
  experiences: {
    id: string
    company: string
    position: string
    description?: string | null
    startDate: Date
    endDate?: Date | null
    current: boolean
    location?: string | null
  }[]
  isOwnProfile: boolean
}

export function ExperienceSection({ experiences, isOwnProfile }: ExperienceSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Experiencia</h2>
        {isOwnProfile && (
          <button className="flex items-center space-x-2 text-ott-blue hover:text-ott-blue/80 transition">
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Agregar</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div key={exp.id} className="relative">
            {index < experiences.length - 1 && (
              <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
            )}
            <div className="flex space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-ott-blue/10 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-ott-blue" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{exp.position}</h3>
                <p className="text-ott-blue font-medium">{exp.company}</p>
                {exp.location && (
                  <p className="text-sm text-gray-500">{exp.location}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {format(new Date(exp.startDate), 'MMM yyyy', { locale: es })} -{' '}
                  {exp.current
                    ? 'Presente'
                    : exp.endDate
                    ? format(new Date(exp.endDate), 'MMM yyyy', { locale: es })
                    : ''}
                </p>
                {exp.description && (
                  <p className="text-gray-700 mt-2 whitespace-pre-wrap">{exp.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
