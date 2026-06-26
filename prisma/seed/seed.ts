import { prisma } from '../../src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Semeding database...')

  // Create faculties
  const hospitality = await prisma.faculty.create({
    data: { name: 'Hospitalidad' },
  })

  const gastronomy = await prisma.faculty.create({
    data: { name: 'Gastronomía' },
  })

  const communications = await prisma.faculty.create({
    data: { name: 'Comunicaciones' },
  })

  // Create careers
  const hotelManagement = await prisma.career.create({
    data: {
      name: 'Gestión Hotelera',
      facultyId: hospitality.id,
    },
  })

  const tourism = await prisma.career.create({
    data: {
      name: 'Turismo',
      facultyId: hospitality.id,
    },
  })

  const culinaryArts = await prisma.career.create({
    data: {
      name: 'Artes Culinarias',
      facultyId: gastronomy.id,
    },
  })

  const pastry = await prisma.career.create({
    data: {
      name: 'Pastelería y Repostería',
      facultyId: gastronomy.id,
    },
  })

  const marketing = await prisma.career.create({
    data: {
      name: 'Marketing Digital',
      facultyId: communications.id,
    },
  })

  const journalism = await prisma.career.create({
    data: {
      name: 'Periodismo',
      facultyId: communications.id,
    },
  })

  // Create users
  const password = await bcrypt.hash('password123', 10)

  const student1 = await prisma.user.create({
    data: {
      email: 'maria.garcia@ott.edu',
      password,
      role: 'STUDENT',
      profile: {
        create: {
          firstName: 'María',
          lastName: 'García',
          headline: 'Estudiante de Gestión Hotelera | Apasionada por la hospitalidad',
          location: 'Buenos Aires, Argentina',
          careerId: hotelManagement.id,
          graduationYear: 2026,
          summary: 'Estudiante de último año de Gestión Hotelera con experiencia en atención al cliente y eventos. Busco oportunidades de práctica profesional en hoteles de lujo.',
        },
      },
    },
    include: { profile: true },
  })

  const student2 = await prisma.user.create({
    data: {
      email: 'juan.perez@ott.edu',
      password,
      role: 'STUDENT',
      profile: {
        create: {
          firstName: 'Juan',
          lastName: 'Pérez',
          headline: 'Futuro Chef | Estudiante de Artes Culinarias',
          location: 'Córdoba, Argentina',
          careerId: culinaryArts.id,
          graduationYear: 2025,
          summary: 'Apasionado por la gastronomía argentina y la cocina de autor. Participé en competencias culinarias y busco aprender de los mejores chefs.',
        },
      },
    },
    include: { profile: true },
  })

  const alumni1 = await prisma.user.create({
    data: {
      email: 'ana.martinez@ott.edu',
      password,
      role: 'ALUMNI',
      profile: {
        create: {
          firstName: 'Ana',
          lastName: 'Martínez',
          headline: 'Gerente de Marketing Digital | Alumni Ott 2020',
          location: 'Buenos Aires, Argentina',
          careerId: marketing.id,
          graduationYear: 2020,
          currentCompany: 'Digital Agency',
          summary: 'Alumni de Ott con 5 años de experiencia en marketing digital. Especializada en estrategias de contenido y redes sociales.',
        },
      },
    },
    include: { profile: true },
  })

  const company1 = await prisma.user.create({
    data: {
      email: 'rrhh@hotelluxury.com',
      password,
      role: 'COMPANY',
      company: {
        create: {
          name: 'Hotel Luxury Buenos Aires',
          industry: 'Hospitalidad',
          size: '200-500 empleados',
          description: 'Hotel 5 estrellas en el corazón de Buenos Aires. Buscamos talentos apasionados por la hospitalidad.',
          location: 'Buenos Aires, Argentina',
          website: 'https://hotelluxury.com',
        },
      },
    },
    include: { company: true },
  })

  // Create skills
  const skills = await Promise.all([
    prisma.skill.create({ data: { name: 'Atención al cliente' } }),
    prisma.skill.create({ data: { name: 'Gestión de eventos' } }),
    prisma.skill.create({ data: { name: 'Cocina internacional' } }),
    prisma.skill.create({ data: { name: 'Marketing digital' } }),
    prisma.skill.create({ data: { name: 'Redes sociales' } }),
    prisma.skill.create({ data: { name: 'Inglés' } }),
    prisma.skill.create({ data: { name: 'Liderazgo' } }),
    prisma.skill.create({ data: { name: 'Trabajo en equipo' } }),
  ])

  // Add skills to users
  await prisma.userSkill.createMany({
    data: [
      { profileId: student1.profile!.id, skillId: skills[0].id, level: 4 },
      { profileId: student1.profile!.id, skillId: skills[1].id, level: 3 },
      { profileId: student1.profile!.id, skillId: skills[5].id, level: 4 },
      { profileId: student2.profile!.id, skillId: skills[2].id, level: 5 },
      { profileId: student2.profile!.id, skillId: skills[7].id, level: 4 },
      { profileId: alumni1.profile!.id, skillId: skills[3].id, level: 5 },
      { profileId: alumni1.profile!.id, skillId: skills[4].id, level: 5 },
      { profileId: alumni1.profile!.id, skillId: skills[6].id, level: 4 },
    ],
  })

  // Create experiences
  await prisma.experience.create({
    data: {
      profileId: alumni1.profile!.id,
      company: 'Digital Agency',
      position: 'Gerente de Marketing',
      description: 'Lidero un equipo de 5 personas en estrategias de marketing digital para clientes de diversos sectores.',
      startDate: new Date('2020-03-01'),
      current: true,
      location: 'Buenos Aires',
    },
  })

  // Create educations
  await prisma.education.create({
    data: {
      profileId: student1.profile!.id,
      institution: 'Ott Educación Superior',
      degree: 'Tecnicatura en Gestión Hotelera',
      field: 'Hospitalidad',
      startDate: new Date('2023-03-01'),
      endDate: new Date('2026-12-31'),
    },
  })

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      userId: student1.id,
      content: '¡Hoy tuve mi primera clase práctica de gestión de eventos! Aprendí sobre coordinación de servicios, atención a invitados y manejo de imprevistos. Excitada por aplicar estos conocimientos en mi práctica profesional. 🎉\n\n#GestiónHotelera #OttEducación #Hospitalidad',
      postType: 'TEXT',
    },
  })

  const post2 = await prisma.post.create({
    data: {
      userId: student2.id,
      content: 'Acabo de terminar mi especialización en cocina argentina contemporánea. Les comparto algunas de mis creaciones. ¡La gastronomía es arte! 👨‍\n\n#ArtesCulinarias #CocinaArgentina #Chef',
      postType: 'TEXT',
    },
  })

  const post3 = await prisma.post.create({
    data: {
      userId: alumni1.id,
      content: 'Como alumni de Ott, quiero compartir mi experiencia: la formación que recibí me dio las bases sólidas para crecer en el mundo del marketing digital. A los estudiantes actuales: aprovechen cada oportunidad de aprendizaje. 💪\n\n#AlumniOtt #MarketingDigital #Educación',
      postType: 'TEXT',
    },
  })

  const post4 = await prisma.post.create({
    data: {
      userId: company1.id,
      content: ' ¡Estamos contratando!\n\nBuscamos Recepcionista Junior para nuestro hotel 5 estrellas en Buenos Aires.\n\nRequisitos:\n- Estudiante o graduado de Gestión Hotelera\n- Inglés avanzado\n- Disponibilidad full-time\n\nEnvía tu CV a rrhh@hotelluxury.com\n\n#Empleo #Hospitalidad #BuenosAires',
      postType: 'JOB',
    },
  })

  // Create likes
  await prisma.like.create({
    data: {
      postId: post1.id,
      userId: student2.id,
    },
  })

  await prisma.like.create({
    data: {
      postId: post1.id,
      userId: alumni1.id,
    },
  })

  await prisma.like.create({
    data: {
      postId: post2.id,
      userId: student1.id,
    },
  })

  // Create comments
  await prisma.comment.create({
    data: {
      postId: post1.id,
      userId: student2.id,
      content: '¡Qué bueno María! Yo también estoy esperando mi clase práctica de eventos.',
    },
  })

  await prisma.comment.create({
    data: {
      postId: post3.id,
      userId: student1.id,
      content: 'Gracias por el consejo Ana. ¿Qué área te gustaría recomendar para especializarse?',
    },
  })

  // Create connections
  await prisma.connection.create({
    data: {
      requesterId: student1.id,
      receiverId: student2.id,
      status: 'ACCEPTED',
    },
  })

  await prisma.connection.create({
    data: {
      requesterId: student1.id,
      receiverId: alumni1.id,
      status: 'ACCEPTED',
    },
  })

  await prisma.connection.create({
    data: {
      requesterId: student2.id,
      receiverId: alumni1.id,
      status: 'PENDING',
    },
  })

  // Create job posting
  await prisma.jobPosting.create({
    data: {
      companyId: company1.company!.id,
      title: 'Recepcionista Junior',
      description: 'Buscamos recepcionista junior para hotel 5 estrellas. Responsable de check-in/check-out, atención telefónica y coordinación con otros departamentos.',
      requirements: 'Estudiante o graduado de Gestión Hotelera, inglés avanzado, disponibilidad full-time',
      type: 'FULL_TIME',
      location: 'Buenos Aires, Argentina',
      salaryMin: 500000,
      salaryMax: 700000,
      active: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  })

  // Create forum categories
  await prisma.forumCategory.create({
    data: {
      name: 'General',
      description: 'Discusiones generales sobre la vida en Ott',
    },
  })

  await prisma.forumCategory.create({
    data: {
      name: 'Gestión Hotelera',
      description: 'Temas específicos de la carrera de Gestión Hotelera',
      careerId: hotelManagement.id,
    },
  })

  await prisma.forumCategory.create({
    data: {
      name: 'Artes Culinarias',
      description: 'Recetas, técnicas y discusiones culinarias',
      careerId: culinaryArts.id,
    },
  })

  await prisma.forumCategory.create({
    data: {
      name: 'Bolsa de Trabajo',
      description: 'Ofertas laborales y consejos para buscar empleo',
    },
  })

  // Create forum threads
  await prisma.forumThread.create({
    data: {
      categoryId: (await prisma.forumCategory.findFirst({ where: { name: 'General' } }))!.id,
      userId: student1.id,
      title: '¿Cómo organizarse para estudiar y trabajar?',
      content: 'Hola a todos! Estoy trabajando medio tiempo y estudiando. ¿Alguien tiene consejos para organizar mejor el tiempo?',
    },
  })

  await prisma.forumThread.create({
    data: {
      categoryId: (await prisma.forumCategory.findFirst({ where: { name: 'Artes Culinarias' } }))!.id,
      userId: student2.id,
      title: 'Receta: Risotto de hongos',
      content: 'Les comparto mi receta de risotto de hongos. Ingredientes: arroz arborio, hongos variados, caldo de verduras, vino blanco, parmesano...',
    },
  })

  // Create groups
  await prisma.group.create({
    data: {
      name: 'Alumni Ott',
      description: 'Grupo para egresados de Ott Educación Superior',
      privacy: 'PUBLIC',
      members: {
        create: {
          userId: alumni1.id,
          role: 'ADMIN',
        },
      },
    },
  })

  await prisma.group.create({
    data: {
      name: 'Estudiantes de Hospitalidad',
      description: 'Grupo para estudiantes de las carreras de Hospitalidad',
      careerId: hospitality.id,
      privacy: 'PUBLIC',
      members: {
        create: {
          userId: student1.id,
          role: 'ADMIN',
        },
      },
    },
  })

  // Create events
  await prisma.event.create({
    data: {
      creatorId: alumni1.id,
      title: 'Networking: Alumni y Estudiantes',
      description: 'Evento de networking para conectar alumni con estudiantes actuales. Oportunidad de hacer contactos profesionales.',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours
      location: 'Campus Ott, Buenos Aires',
      type: 'PRESENTIAL',
      attendees: {
        create: [
          { userId: alumni1.id, status: 'GOING' },
          { userId: student1.id, status: 'GOING' },
        ],
      },
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('')
  console.log('📧 Users created:')
  console.log('  Student 1: maria.garcia@ott.edu / password123')
  console.log('  Student 2: juan.perez@ott.edu / password123')
  console.log('  Alumni 1: ana.martinez@ott.edu / password123')
  console.log('  Company: rrhh@hotelluxury.com / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })