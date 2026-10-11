/**
 * Timezone-Accurate Live Countdown Timer
 * Computes difference against fixed IST target (Asia/Kolkata +05:30)
 * Uses visibilitychange to prevent drift and an accessible live region for screen readers.
 */

export const initCountdown = (targetIsoString) => {
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-mins');
  const secsEl = document.getElementById('count-secs');
  const liveRegionEl = document.getElementById('countdown-sr-live');
  const celebrationEl = document.getElementById('countdown-celebration');
  const tilesGridEl = document.getElementById('countdown-tiles-grid');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  // Target epoch time (parsed ISO string already includes +05:30 offset)
  const targetTime = new Date(targetIsoString).getTime();

  let timerId = null;
  let lastAnnouncedMinute = -1;

  const updateDisplay = () => {
    const now = Date.now();
    const diff = targetTime - now;

    if (diff <= 0) {
      // Reached or passed wedding moment
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';

      if (tilesGridEl && celebrationEl) {
        tilesGridEl.style.display = 'none';
        celebrationEl.style.display = 'block';
      }

      if (liveRegionEl) {
        liveRegionEl.textContent = 'The wedding celebration has arrived! Today is the day!';
      }

      if (timerId) clearInterval(timerId);
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');

    // Accessibility: Update screen reader announcement once every minute
    if (minutes !== lastAnnouncedMinute) {
      lastAnnouncedMinute = minutes;
      if (liveRegionEl) {
        liveRegionEl.textContent = `${days} days, ${hours} hours, and ${minutes} minutes until the wedding ceremony.`;
      }
    }
  };

  const startTimer = () => {
    updateDisplay();
    if (!timerId) {
      timerId = setInterval(updateDisplay, 1000);
    }
  };

  const stopTimer = () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  };

  // Prevent drift when tab goes into background
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopTimer();
    } else {
      startTimer();
    }
  });

  startTimer();
};
