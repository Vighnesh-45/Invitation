/**
 * Events Renderer Module
 * Dynamically builds event timeline cards and venue map blocks from events.json (English Only)
 */

import { buildGoogleCalendarUrl, downloadICS } from './calendar.js';
import { buildDirectionsUrl } from './maps.js';

// Cultural SVG Icons for Event Types
const EVENT_ICONS = {
  henna: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke-dasharray="2 3"/><path d="M12 6c-3.31 0-6 2.69-6 6 0 2.5 1.5 4.5 3.5 5.5"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/></svg>`,
  turmeric: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><ellipse cx="12" cy="16" rx="8" ry="4"/><path d="M4 16c0-4 3.5-9 8-12 4.5 3 8 8 8 12"/><circle cx="12" cy="10" r="1.5" fill="currentColor"/></svg>`,
  mandap: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 20h18M5 20V9M19 20V9M2 9l10-6 10 6"/><path d="M9 20v-5a3 3 0 0 1 6 0v5"/><circle cx="12" cy="6" r="1" fill="currentColor"/></svg>`
};

const formatEventDateRange = (startIso, endIso) => {
  if (!startIso) {
    return { dateStr: 'Date To Be Announced', timeStr: '' };
  }

  // Date-only strings (e.g. "2026-12-10") have no time — skip time display
  const hasTime = startIso.includes('T');

  const start = new Date(startIso);

  if (isNaN(start.getTime())) {
    return { dateStr: 'Date To Be Announced', timeStr: '' };
  }

  const dateStr = start.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Kolkata'
  });

  if (!hasTime) {
    return { dateStr, timeStr: '' };
  }

  const startTimeStr = start.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  });

  if (endIso) {
    const end = new Date(endIso);
    if (!isNaN(end.getTime())) {
      const endTimeStr = end.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      });
      return { dateStr, timeStr: `${startTimeStr} – ${endTimeStr} IST` };
    }
  }

  return { dateStr, timeStr: `${startTimeStr} onwards IST` };
};

export const renderEvents = (events) => {
  const timelineContainer = document.getElementById('events-timeline-container');
  const mapsContainer = document.getElementById('maps-container');
  const masterIcsBtn = document.getElementById('master-ics-btn');

  if (!timelineContainer || !events || !events.length) return;

  // 1. Render Timeline Cards
  timelineContainer.innerHTML = '';
  events.forEach((event, idx) => {
    const { dateStr, timeStr } = formatEventDateRange(event.start, event.end);
    const iconSvg = EVENT_ICONS[event.icon] || EVENT_ICONS.mandap;

    const card = document.createElement('article');
    card.className = `event-card reveal-on-scroll reveal-stagger-${(idx % 4) + 1}`;
    card.id = `event-${event.id}`;

    card.innerHTML = `
      <div class="event-card-header">
        <div class="event-icon-badge" aria-hidden="true">
          ${iconSvg}
        </div>
        <div class="event-title-stack">
          <h3 class="event-title-en">${event.title.en}</h3>
        </div>
      </div>

      <div class="event-datetime-badge">
        <span aria-hidden="true">🗓</span>
        <span>${dateStr}${timeStr ? ` • ${timeStr}` : ''}</span>
      </div>

      <div class="event-meta-block">
        <div class="event-meta-row">
          <span class="event-meta-label">Venue:</span>
          <span><strong>${event.venueName}</strong>, ${event.address}</span>
        </div>
        ${event.dressCode ? `
        <div class="event-dress-code">
          <strong>Dress Code:</strong> ${event.dressCode.en}
        </div>` : ''}
      </div>

${event.description?.en ? `
      <p class="event-description-text">
        "${event.description.en}"
      </p>` : ''}

      <div class="event-actions-row">
        <a href="${buildGoogleCalendarUrl(event)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size: 0.9rem; padding: 10px 20px;">
          <span>Add to Google Calendar</span>
        </a>
        <button type="button" class="btn btn-outline single-ics-btn" data-event-id="${event.id}" style="font-size: 0.9rem; padding: 10px 20px;">
          <span>Apple / Outlook (.ics)</span>
        </button>
        <a href="${event.directMapUrl || buildDirectionsUrl(event.mapQuery)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="font-size: 0.9rem; padding: 10px 20px;">
          <span>Directions</span>
        </a>
      </div>
    `;

    // Handle single ICS download
    const icsBtn = card.querySelector('.single-ics-btn');
    if (icsBtn) {
      icsBtn.addEventListener('click', () => {
        downloadICS(event, `${event.id}-harshita-harshal.ics`);
      });
    }

    timelineContainer.appendChild(card);
  });

  // 2. Render Venue Map Cards
  if (mapsContainer) {
    mapsContainer.innerHTML = '';
    events.forEach((event, idx) => {
      const mapCard = document.createElement('div');
      mapCard.className = `map-card reveal-on-scroll reveal-stagger-${(idx % 4) + 1}`;
      mapCard.id = `map-${event.id}`;

      mapCard.innerHTML = `
        <div class="map-card-header">
          <h4 style="font-size: 1.25rem; color: var(--maroon); margin-bottom: 4px;">${event.venueName}</h4>
          <div style="font-size: 0.9rem; color: var(--ink-muted);">${event.title.en}</div>
        </div>
        <div class="map-iframe-container" data-map-query="${encodeURIComponent(event.mapQuery)}" data-map-title="Map for ${event.venueName}">
          <!-- Lazy loaded iframe inserted via maps.js -->
        </div>
        <div class="map-card-footer">
          <span class="map-address-text">📍 ${event.address}</span>
          <a href="${event.directMapUrl || buildDirectionsUrl(event.mapQuery)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size: 0.85rem; padding: 8px 18px;">
            Open in Google Maps
          </a>
        </div>
      `;

      mapsContainer.appendChild(mapCard);
    });
  }

  // 3. Master Calendar Download All Events
  if (masterIcsBtn) {
    masterIcsBtn.addEventListener('click', () => {
      downloadICS(events, 'harshita-harshal-all-wedding-events.ics');
    });
  }
};
