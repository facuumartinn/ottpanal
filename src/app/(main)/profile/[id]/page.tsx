import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ExperienceSection } from '@/components/profile/ExperienceSection'
import { EducationSection } from '@/components/profile/EducationSection'
import { SkillsSection } from '@/components/profile/SkillsSection'
import { notFound } from 'next/navigation'

interface ProfilePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await auth()
  const { id: userId } = await params

  // Get user profile
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: {
        include: {
          career: {
            include: {
              faculty: true,
            },
          },
          experiences: true,
          educations: true,
          skills: {
            include: {
              skill: true,
            },
          },
          languages: true,
          certifications: true,
          projects: true,
          awards: true,
        },
      },
    },
  })

  if (!user || !user.profile) {
    notFound()
  }

  const isOwnProfile = session?.user?.id === userId

  return (
    <div className="max-w-4xl mx-auto">
      <ProfileHeader
        profile={user.profile}
        isOwnProfile={isOwnProfile}
        userRole={user.role}
      />

      <div className="mt-6 space-y-6">
        {/* About Section */}
        {user.profile.summary && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Acerca de</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{user.profile.summary}</p>
          </div>
        )}

        {/* Experience Section */}
        {user.profile.experiences.length > 0 && (
          <ExperienceSection experiences={user.profile.experiences} isOwnProfile={isOwnProfile} />
        )}

        {/* Education Section */}
        {user.profile.educations.length > 0 && (
          <EducationSection educations={user.profile.educations} isOwnProfile={isOwnProfile} />
        )}

        {/* Skills Section */}
        {user.profile.skills.length > 0 && (
          <SkillsSection skills={user.profile.skills} isOwnProfile={isOwnProfile} />
        )}

        {/* Languages Section */}
        {user.profile.languages.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Idiomas</h2>
            <div className="space-y-3">
              {user.profile.languages.map((lang) => (
                <div key={lang.id} className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">{lang.language}</span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {user.profile.certifications.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Certificaciones</h2>
            <div className="space-y-4">
              {user.profile.certifications.map((cert) => (
                <div key={cert.id} className="border-l-4 border-ott-honey pl-4">
                  <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                  <p className="text-sm text-gray-600">{cert.issuer}</p>
                  <p className="text-xs text-gray-500">
                    Emitida: {new Date(cert.issueDate).toLocaleDateString('es-ES')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {user.profile.projects.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Proyectos</h2>
            <div className="space-y-4">
              {user.profile.projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">{project.title}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-600 mt-2">{project.description}</p>
                  )}
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-ott-blue hover:underline mt-2 inline-block"
                    >
                      Ver proyecto →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
