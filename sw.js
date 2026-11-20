const CACHE_NAME = 'ocr-app-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Instala o service worker e salva os arquivos no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercepta as requisições: tenta pegar da internet, se falhar (offline) pega do cache
self.addEventListener('fetch', event => {
  // Ignora requisições que não sejam GET (como POST)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Se a requisição deu certo, atualiza o cache
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Se falhou (offline), busca no cache
        return caches.match(event.request);
      })
  );
});
