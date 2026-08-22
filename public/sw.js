/**
 * Offline is not a nice-to-have here. Venue wifi dies, and a demo that needs the
 * network is a demo you might not get to give. The seeded memory, its audio and all
 * twelve of its lessons ship in the bundle, so with this worker installed the whole
 * thing runs with the network disabled.
 *
 * Strategy, deliberately split:
 *  - navigations: network first, cache as fallback. Online you always get the
 *    current deploy; offline you get the last page you saw. A cache-first shell
 *    would serve a stale build after every deploy, which is worse.
 *  - everything else same-origin: cache first, refreshed in the background. Hashed
 *    Next chunks never change under a given name, and her audio is 2MB we do not
 *    want to fetch twice.
 *  - the API: never cached. A stale lesson is fine from localStorage; a stale
 *    response pretending to be fresh is not.
 */
const VERSION = "heirloom-v6";
const PRECACHE = [
  "/",
  "/record",
  "/memory/mem_seed",
  "/memory/mem_seed_en",
  // One lesson URL, so the /lesson/[id] shell exists offline for every format.
  "/lesson/mem_seed?format=cookalong",
  "/synthetic-test.wav",
  "/synthetic-en.wav",
  "/hero-telling.webp",
  // Emoji ship as SVG files, so they have to be cached like any other asset.
  ...["home", "mic", "book", "grandma", "bowl", "speech", "shuffle", "bulb", "question", "speaker"].map(
    (n) => `/emoji/${n}.svg`
  ),
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  // Every storybook page of every seeded memory, so the picture books work with
  // the network off too.
  ...["mem_seed", "mem_seed_en"].flatMap((id) =>
    Array.from({ length: 6 }, (_, i) => `/storybook/${id}/panel-${i + 1}.webp`)
  ),
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then(async (cache) => {
      // One failure must not abandon the whole precache.
      await Promise.all(
        PRECACHE.map((url) => cache.add(new Request(url, { cache: "reload" })).catch(() => {}))
      );
      await self.skipWaiting();
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.filter((n) => n !== VERSION).map((n) => caches.delete(n)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  // React Server Component payloads are tied to the exact build that produced them.
  // Serving a cached one to a newer runtime breaks React mid-stream, so they are
  // never cached and never served from cache — offline, the cached HTML is enough.
  if (url.searchParams.has("_rsc") || request.headers.get("RSC") === "1") return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(VERSION);
          cache.put(request, fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(VERSION);
          // Exact URL first. Then the same path ignoring the query — every lesson
          // format is served by one /lesson/[id] shell and picks its format from
          // the query on the client, so a format nobody opened while online still
          // works offline. All four are already in the bundle.
          return (
            (await cache.match(request)) ??
            (await cache.match(request, { ignoreSearch: true })) ??
            (await cache.match("/memory/mem_seed")) ??
            (await cache.match("/")) ??
            Response.error()
          );
        }
      })()
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(VERSION);
      const hit = await cache.match(request);
      if (hit) {
        // Refresh in the background; never block on it.
        event.waitUntil(
          fetch(request)
            .then((res) => res.ok && cache.put(request, res.clone()))
            .catch(() => {})
        );
        return hit;
      }
      try {
        const fresh = await fetch(request);
        if (fresh.ok && fresh.status === 200) cache.put(request, fresh.clone());
        return fresh;
      } catch {
        return Response.error();
      }
    })()
  );
});
