/**
 * Google Maps Embed and Directions Generator
 * Lazily loads iframes when map cards enter the viewport
 */

export const buildDirectionsUrl = (mapQuery) => {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;
};

export const buildEmbedMapUrl = (mapQuery) => {
  return `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
};

/**
 * Initializes lazy loading of Google Map iframes to protect initial load performance
 */
export const initLazyMaps = () => {
  const mapContainers = document.querySelectorAll('.map-iframe-container[data-map-query]');
  if (!mapContainers.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const container = entry.target;
        const query = container.getAttribute('data-map-query');
        const title = container.getAttribute('data-map-title') || 'Venue Location Map';

        if (query && !container.querySelector('iframe')) {
          const iframe = document.createElement('iframe');
          iframe.src = buildEmbedMapUrl(query);
          iframe.title = title;
          iframe.setAttribute('loading', 'lazy');
          iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
          iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups');
          iframe.allowFullscreen = true;
          container.appendChild(iframe);
        }

        obs.unobserve(container);
      }
    });
  }, { rootMargin: '200px 0px' });

  mapContainers.forEach(el => observer.observe(el));
};
