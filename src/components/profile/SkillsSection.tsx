'use client'

import { Star, Plus } from 'lucide-react'

interface SkillsSectionProps {
  skills: {
    id: string
    skill: {
      name: string
    }
    level: number
  }[]
  isOwnProfile: boolean
}

export function SkillsSection({ skills, isOwnProfile }: SkillsSectionProps) {
  const getLevelLabel = (level: number) => {
    const labels = ['', 'Básico', 'Intermedio', 'Avanzado', 'Experto', 'Maestro']
    return labels[level] || 'Intermedio'
  }

  const getLevelColor = (level: number) => {
    if (level <= 2) return 'bg-gray-200'
    if (level === 3) return 'bg-ott-cyan'
    if (level === 4) return 'bg-ott-blue'
    return 'bg-ott-honey'
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Habilidades</h2>
        {isOwnProfile && (
          <button className="flex items-center space-x-2 text-ott-blue hover:text-ott-blue/80 transition">
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Agregar</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skillItem) => (
          <div
            key={skillItem.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{skillItem.skill.name}</h3>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <Star
                    key={level}
                    className={`w-4 h-4 ${
                      level <= skillItem.level
                        ? 'text-ott-honey fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getLevelColor(skillItem.level)}`}
                style={{ width: `${(skillItem.level / 5) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{getLevelLabel(skillItem.level)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
