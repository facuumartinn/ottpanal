# OttPanal

Red social interna para Ott Educación Superior - Conecta alumnos, alumni y empresas.

##  Características

- **Perfiles profesionales** estilo LinkedIn con avatares hexagonales
- **Feed "El Panal"** para compartir publicaciones
- **Sistema de conexiones** entre usuarios
- **Bolsa de trabajo** para empresas
- **Foros** por carrera
- **Grupos** de interés
- **Mensajería** interna
- **Eventos** y networking

## 🛠️ Stack Tecnológico

- **Frontend & Backend**: Next.js 14 (App Router)
- **Base de datos**: SQLite (desarrollo) / MySQL (producción)
- **ORM**: Prisma
- **Autenticación**: NextAuth.js
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React

## 📦 Instalación

```bash
# Clonar repositorio
git clone https://github.com/TU_USUARIO/ottpanal.git
cd ottpanal

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Cargar datos de prueba (opcional)
npm run db:seed

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 👥 Usuarios de Prueba

Después de ejecutar `npm run db:seed`:

| Email | Contraseña | Rol |
|-------|-----------|-----|
| maria.garcia@ott.edu | password123 | Alumno |
| juan.perez@ott.edu | password123 | Alumno |
| ana.martinez@ott.edu | password123 | Alumni |
| rrhh@hotelluxury.com | password123 | Empresa |

##  Despliegue

### Opción 1: Vercel (Recomendado)

1. Sube tu código a GitHub
2. Importa el repositorio en [Vercel](https://vercel.com)
3. Configura las variables de entorno:
   - `DATABASE_URL`: URL de MySQL de Hostinger
   - `AUTH_SECRET`: Genera uno seguro
   - `AUTH_URL`: Tu dominio en Vercel
4. Despliega

### Opción 2: VPS Hostinger

Consulta la guía completa en [DEPLOY.md](./DEPLOY.md)

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm start            # Iniciar en producción
npm run lint         # Linting
npm run db:seed      # Cargar datos de prueba
```

## 🎨 Identidad Visual

- **Azul Ott**: `#003A70` (Primario)
- **Cyan**: `#00B4D8` (Hospitalidad)
- **Verde Oliva**: `#B8A88A` (Gastronomía)
- **Naranja**: `#FF6B35` (Comunicaciones)
- **Amarillo Miel**: `#F5A623` (Acentos)

## 📄 Licencia

Este proyecto es propiedad de Ott Educación Superior.
