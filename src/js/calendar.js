/**
 * Calendar Link & ICS Generator
 * Generates Google Calendar Template URLs and RFC 5545 compliant .ics files
 */

const formatToICSDate = (isoString) => {
  return new Date(isoString).toISOString().replace(/[-:]|\.\d{3}/g, '');
};

const escapeICSField = (text) => {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
};

/**
 * Builds a direct Google Calendar template URL
 */
const getEndTime = (event) => {
  if (event.end) return event.end;
  if (!event.start) return new Date().toISOString();
  // fallback: start + 2 hours
  const d = new Date(event.start);
  if (isNaN(d.getTime())) return new Date().toISOString();
  d.setHours(d.getHours() + 2);
  return d.toISOString();
};

export const buildGoogleCalendarUrl = (event) => {
  if (!event.start) return '#';
  const startFmt = formatToICSDate(event.start);
  const endFmt = formatToICSDate(getEndTime(event));
  const title = encodeURIComponent(event.title.en);
  const details = encodeURIComponent(
    `${event.description?.en || ''}\n\n(Traditional dress: ${event.dressCode?.en || 'Festive Indian'})`
  );
  const location = encodeURIComponent(`${event.venueName}, ${event.address}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startFmt}/${endFmt}&details=${details}&location=${location}&ctz=Asia/Kolkata`;
};

/**
 * Generates RFC 5545 VEVENT string for a single event
 */
const generateVEvent = (event) => {
  const dtStamp = formatToICSDate(new Date().toISOString());
  const dtStart = event.start ? formatToICSDate(event.start) : dtStamp;
  const dtEnd = formatToICSDate(getEndTime(event));
  const uid = `${event.id}-harshita-harshal-2026@wedding`;

  return [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeICSField(event.title.en)}`,
    `DESCRIPTION:${escapeICSField(event.description?.en || '')}`,
    `LOCATION:${escapeICSField(`${event.venueName}, ${event.address}`)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT'
  ].join('\r\n');
};

/**
 * Downloads a .ics file containing one or multiple events
 */
export const downloadICS = (events, filename = 'harshita-harshal-wedding.ics') => {
  const eventList = Array.isArray(events) ? events : [events];
  const vevents = eventList.map(generateVEvent).join('\r\n');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Harshita and Harshal Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    vevents,
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
