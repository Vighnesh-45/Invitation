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
export const buildGoogleCalendarUrl = (event) => {
  const startFmt = formatToICSDate(event.start);
  const endFmt = formatToICSDate(event.end);
  const title = encodeURIComponent(event.title.en);
  const details = encodeURIComponent(
    `${event.description.en}\n\n(Traditional dress: ${event.dressCode?.en || 'Festive Indian'})`
  );
  const location = encodeURIComponent(`${event.venueName}, ${event.address}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startFmt}/${endFmt}&details=${details}&location=${location}&ctz=Asia/Kolkata`;
};

/**
 * Generates RFC 5545 VEVENT string for a single event
 */
const generateVEvent = (event) => {
  const dtStamp = formatToICSDate(new Date().toISOString());
  const dtStart = formatToICSDate(event.start);
  const dtEnd = formatToICSDate(event.end);
  const uid = `${event.id}-rohan-simran-2027@wedding`;

  return [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeICSField(event.title.en)}`,
    `DESCRIPTION:${escapeICSField(event.description.en)}`,
    `LOCATION:${escapeICSField(`${event.venueName}, ${event.address}`)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT'
  ].join('\r\n');
};

/**
 * Downloads a .ics file containing one or multiple events
 */
export const downloadICS = (events, filename = 'rohan-simran-wedding.ics') => {
  const eventList = Array.isArray(events) ? events : [events];
  const vevents = eventList.map(generateVEvent).join('\r\n');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Rohan and Simran Wedding Invitation//EN',
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
