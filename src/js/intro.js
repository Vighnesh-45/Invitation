/**
 * Intro Experience & Open Transition Handler
 */

export const initIntro = () => {
  const introOverlay = document.getElementById('intro-overlay');
  const openBtn = document.getElementById('open-invitation-btn');
  const heroHeading = document.getElementById('hero-title');
  const replayBtn = document.getElementById('replay-intro-btn');

  if (!introOverlay || !openBtn) return;

  const closeIntro = () => {
    introOverlay.classList.add('intro-hidden');
    sessionStorage.setItem('wedding_intro_seen', 'true');

    // Accessibility: Shift focus to main content / hero heading
    setTimeout(() => {
      if (heroHeading) {
        heroHeading.setAttribute('tabindex', '-1');
        heroHeading.focus();
      }
    }, 900);
  };

  const showIntro = () => {
    introOverlay.classList.remove('intro-hidden');
    openBtn.focus();
  };

  openBtn.addEventListener('click', closeIntro);

  if (replayBtn) {
    replayBtn.addEventListener('click', showIntro);
  }

  // Check if previously seen in current session
  if (sessionStorage.getItem('wedding_intro_seen') === 'true') {
    introOverlay.classList.add('intro-hidden');
  }
};
