import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Briefcase, MapPin, DollarSign, Clock, Building } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function JobsPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Get active job postings
  const jobs = await prisma.jobPosting.findMany({
    where: {
      active: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
    include: {
      company: {
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
  })

  const jobTypeLabels = {
    FULL_TIME: 'Tiempo completo',
    PART_TIME: 'Medio tiempo',
    CONTRACT: 'Contrato',
    INTERNSHIP: 'Pasantía',
    REMOTE: 'Remoto',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-ott-blue to-ott-cyan rounded-xl shadow p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Bolsa de Trabajo</h1>
        <p className="text-white/90">
          Encuentra oportunidades laborales y poliniza tu talento
        </p>
      </div>

      {/* Job Listings */}
      {jobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No hay ofertas de empleo disponibles
          </h3>
          <p className="text-gray-500">
            Las empresas publicarán sus ofertas aquí pronto.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition block"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      {job.company.name}
                    </span>
                    {job.location && (
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </span>
                    )}
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {jobTypeLabels[job.type]}
                    </span>
                    {job.salaryMin && job.salaryMax && (
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 line-clamp-3">
                    {job.description}
                  </p>
                </div>
                <div className="ml-4 text-right">
                  <span className="inline-block px-3 py-1 bg-ott-honey/20 text-ott-blue rounded-full text-xs font-medium">
                    {job._count.applications} aplicantes
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
