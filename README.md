# WKF Test App

Aplicacion web movil-first para examenes de reglamento WKF (Kata, Kumite y Para-Karate), creada con React + Node toolchain + Supabase y lista para desplegar en Netlify.

## Stack
- React (Vite)
- Bootstrap Icons (sin emojis)
- Supabase (banco de preguntas e intentos)
- Netlify

## 1) Configuracion local
```bash
npm install
cp .env.example .env
```

Completa en `.env`:
```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## 2) Configurar Supabase
1. Abre SQL Editor en tu proyecto Supabase.
2. Ejecuta `supabase/schema.sql`.
3. Ejecuta `supabase/seed.sql`.

## 3) Ejecutar
```bash
npm run dev
```

## 4) Deploy en Netlify
1. Subir repo a GitHub.
2. En Netlify: `Add new project` -> conecta repo.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Variables de entorno en Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Notas
- El usuario puede repetir el examen ilimitadamente.
- En cada intento las preguntas salen aleatorias.
- Si Supabase no esta configurado, la app usa un banco local de respaldo.
- Puedes ampliar el banco agregando mas inserts en `supabase/seed.sql` usando tus documentos originales.
