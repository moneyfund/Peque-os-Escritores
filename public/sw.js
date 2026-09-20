const CACHE = 'pequenos-escritores-v8-same-origin-auth'
const CORE = ['/', '/icon.svg', '/manifest.webmanifest']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).catch(() => {}))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
    ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return

  // Never intercept Firebase OAuth helpers. They are reverse-proxied by Vercel
  // and must reach Firebase unchanged, especially on Safari/mobile browsers.
  if (url.pathname.startsWith('/__/auth/') || url.pathname.startsWith('/__/firebase/')) return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone()
        caches.open(CACHE).then((cache) => cache.put(event.request, copy)).catch(() => {})
        return response
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/'))),
  )
})
