'use client'

import { GraduationCap, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface EducationSectionProps {
  educations: {
    id: string
    institution: string
    degree: string
    field?: string | null
    startDate: Date
    endDate?: Date | null
    grade?: string | null
    activities?: string | null
  }[]
  isOwnProfile: boolean
}

export function EducationSection({ educations, isOwnProfile }: EducationSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Educación</h2>
        {isOwnProfile && (
          <button className="flex items-center space-x-2 text-ott-blue hover:text-ott-blue/80 transition">
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Agregar</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {educations.map((edu, index) => (
          <div key={edu.id} className="relative">
            {index < educations.length - 1 && (
              <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
            )}
            <div className="flex space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-ott-cyan/10 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-ott-cyan" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{edu.degree}</h3>
                {edu.field && (
                  <p className="text-ott-cyan font-medium">{edu.field}</p>
                )}
                <p className="text-gray-700 font-medium">{edu.institution}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {format(new Date(edu.startDate), 'MMM yyyy', { locale: es })} -{' '}
                  {edu.endDate
                    ? format(new Date(edu.endDate), 'MMM yyyy', { locale: es })
                    : 'Presente'}
                </p>
                {edu.grade && (
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Calificación:</span> {edu.grade}
                  </p>
                )}
                {edu.activities && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Actividades:</span> {edu.activities}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
