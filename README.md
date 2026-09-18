# Pequeños Escritores

Aplicación web educativa para educación inicial. Incluye lecciones interactivas, perfiles infantiles, progreso por usuario, grupos de clase, invitaciones por ID y asignación de lecciones.

## Stack

- React 19 + Vite 8
- Firebase Authentication (Google)
- Cloud Firestore
- Firebase Storage
- Motion for React
- Lucide React
- Vercel

## Funciones incluidas

- Bienvenida animada y diseño responsive para móvil/tablet/PC.
- Lecciones de vocales, trazado, escucha, asociación, conteo, orden numérico, colores, formas, patrones y vocabulario.
- Síntesis de voz del navegador para ejercicios auditivos.
- Trazado táctil con `canvas` para letras y números.
- Google Sign-In con sesión persistente.
- Perfil editable: nombre, idioma, avatar infantil o foto desde galería.
- ID automático por usuario para invitaciones.
- Grupos: creador/docente, miembros/estudiantes, invitaciones, tareas y progreso por lección.
- Registro de intentos y puntaje por lección.
- Interfaz ES/EN.
- Manifest PWA para instalación desde el navegador.
- Modo demo local si Firebase todavía no está configurado.

## Configurar Firebase

1. Crea un proyecto en Firebase.
2. Habilita **Authentication > Google**.
3. Crea Cloud Firestore y Storage.
4. Registra una Web App y copia su configuración.
5. En local crea `.env.local` usando `.env.example`.
6. En Vercel agrega las mismas variables con prefijo `VITE_`.
7. Publica las reglas incluidas:
   - `firestore.rules`
   - `storage.rules`

Variables:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Desarrollo

```bash
npm install
npm run dev
```

## Producción

```bash
npm run build
```

Vercel detecta Vite. El archivo `vercel.json` incluye el fallback necesario para rutas SPA.

## Modelo Firestore

- `users/{uid}`: datos privados del perfil y `groupIds`.
- `users/{uid}/progress/{lessonId}`: progreso individual.
- `publicProfiles/{uid}`: nombre, avatar e ID público mínimo para encontrar miembros.
- `groups/{groupId}`: datos del grupo.
- `groups/{groupId}/members/{uid}`: perfil mínimo + rol.
- `groups/{groupId}/assignments/{assignmentId}`: lecciones asignadas.
- `groups/{groupId}/memberProgress/{uid}/lessons/{lessonId}`: progreso visible dentro del grupo.
- `invitations/{groupId_uid}`: invitaciones pendientes/aceptadas/rechazadas.

## Privacidad

Los grupos no exponen el correo de los menores a otros miembros. Los documentos de miembros contienen solamente nombre visible, avatar, rol y progreso pedagógico. Antes de uso escolar real deben revisarse consentimiento familiar, políticas del centro y legislación local aplicable a datos de menores.
