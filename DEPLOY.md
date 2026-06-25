# OttPanal - Guía de Despliegue

## Opción A: Vercel (Recomendado - Más fácil)

### 1. Crear cuenta en Vercel
- Ve a https://vercel.com
- Regístrate con GitHub

### 2. Subir código a GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/ottpanal.git
git push -u origin main
```

### 3. Desplegar en Vercel
- En Vercel: "New Project" → Importar repositorio de GitHub
- Vercel detectará Next.js automáticamente
- Configurar variables de entorno:
  - `DATABASE_URL`: URL de MySQL de Hostinger
  - `AUTH_SECRET`: Generar con `openssl rand -base64 32`
  - `AUTH_URL`: https://tu-dominio.vercel.app

### 4. Base de Datos MySQL en Hostinger
- En hPanel de Hostinger: "Bases de datos" → "MySQL"
- Crear base de datos: `ottpanal_db`
- Copiar credenciales
- En Vercel, configurar `DATABASE_URL`:
  ```
  mysql://usuario:password@host:3306/ottpanal_db
  ```

### 5. Migrar Base de Datos
```bash
npx prisma migrate deploy
```

---

## Opción B: VPS Hostinger (Más control)

### 1. Contratar VPS Hostinger
- Plan: KVM 1 ($5.99/mes)
- OS: Ubuntu 22.04

### 2. Conectar por SSH
```bash
ssh root@tu-vps-ip
```

### 3. Instalar dependencias
```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Instalar Git
apt install -y git

# Instalar PM2
npm install -g pm2

# Instalar Nginx
apt install -y nginx
```

### 4. Clonar proyecto
```bash
cd /var/www
git clone https://github.com/TU_USUARIO/ottpanal.git
cd ottpanal
npm install
```

### 5. Configurar variables de entorno
```bash
cp .env.example .env
nano .env
```

Editar con:
```
DATABASE_URL="mysql://usuario:password@localhost:3306/ottpanal_db"
AUTH_SECRET="tu-secret-aqui"
AUTH_URL="https://tu-dominio.com"
```

### 6. Crear base de datos MySQL
```bash
mysql -u root -p
CREATE DATABASE ottpanal_db;
CREATE USER 'ottpanal'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON ottpanal_db.* TO 'ottpanal'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 7. Build y migrar
```bash
npx prisma migrate deploy
npm run build
```

### 8. Configurar PM2
```bash
pm2 start npm --name "ottpanal" -- start
pm2 save
pm2 startup
```

### 9. Configurar Nginx
```bash
nano /etc/nginx/sites-available/ottpanal
```

Contenido:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/ottpanal /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 10. SSL con Let's Encrypt
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d tu-dominio.com
```

---

## Migrar de SQLite a MySQL

### 1. Instalar driver MySQL
```bash
npm install mysql2
```

### 2. Cambiar schema.prisma
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### 3. Actualizar .env
```
DATABASE_URL="mysql://usuario:password@host:3306/ottpanal_db"
```

### 4. Generar cliente y migrar
```bash
npx prisma generate
npx prisma migrate deploy
```

---

## Variables de Entorno Requeridas

```env
# Base de datos
DATABASE_URL="mysql://usuario:password@host:3306/ottpanal_db"

# NextAuth
AUTH_SECRET="generar-con-openssl-rand-base64-32"
AUTH_URL="https://tu-dominio.com"

# Cloudinary (para imágenes)
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"
```

---

## Dominio y DNS

### Si usas Vercel:
1. En Vercel: Settings → Domains
2. Agregar tu dominio
3. Configurar DNS en Hostinger:
   - Tipo: CNAME
   - Nombre: www
   - Valor: cname.vercel-dns.com

### Si usas VPS:
1. Apuntar dominio al IP del VPS
2. Configurar en hPanel: "Dominios" → "Agregar dominio"

---

## Checklist Pre-Despliegue

- [ ] Código subido a GitHub
- [ ] Base de datos MySQL creada
- [ ] Variables de entorno configuradas
- [ ] Migraciones ejecutadas
- [ ] Build exitoso (`npm run build`)
- [ ] Dominio configurado
- [ ] SSL activado
- [ ] Pruebas de login/registro
- [ ] Pruebas de feed y publicaciones

---

## Comandos Útiles

### Desarrollo local
```bash
npm run dev
```

### Build para producción
```bash
npm run build
npm start
```

### Migraciones
```bash
npx prisma migrate dev      # Desarrollo
npx prisma migrate deploy   # Producción
```

### Seed (datos de prueba)
```bash
npm run db:seed
```

### Logs (VPS con PM2)
```bash
pm2 logs ottpanal
pm2 restart ottpanal
pm2 status
```

---

## Soporte

Si tienes problemas:
1. Revisa logs: `pm2 logs ottpanal` o consola de Vercel
2. Verifica variables de entorno
3. Confirma que la base de datos es accesible
4. Revisa permisos de archivos
