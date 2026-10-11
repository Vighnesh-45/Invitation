/**
 * Ambient Festive Flowers & Petals Motion Handler
 * Generates falling marigolds, rose petals, and jasmine buds with natural sway
 */

export const initAmbientEffects = () => {
  const toggleBtn = document.getElementById('toggle-motion-btn');
  const petalsContainer = document.getElementById('ambient-petals');

  // Check if system prefers reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.body.classList.add('motion-paused');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-pressed', 'true');
      toggleBtn.title = 'Animations Paused (Reduced Motion)';
    }
    return;
  }

  // Create generous, beautiful shower of celebratory wedding flowers
  if (petalsContainer) {
    petalsContainer.innerHTML = '';
    const flowerCount = 38;

    // Palette of marigold orange, golden yellow, ruby rose, and jasmine cream
    const flowerTypes = [
      { type: 'marigold-orange', bg: 'radial-gradient(circle at 35% 35%, #FFE082, #FF9E00 60%, #E85D04)', shape: 'petal' },
      { type: 'marigold-yellow', bg: 'radial-gradient(circle at 35% 35%, #FFFDE7, #FFD54F 65%, #FF8F00)', shape: 'petal' },
      { type: 'rose-red', bg: 'radial-gradient(circle at 30% 30%, #FFAAA6, #C82333 70%, #7A1F2B)', shape: 'rose' },
      { type: 'rose-pink', bg: 'radial-gradient(circle at 30% 30%, #FFE5EC, #F28482 70%, #C8553D)', shape: 'rose' },
      { type: 'marigold-blossom', bg: 'radial-gradient(circle, #FFE082 25%, #FF9E00 70%, #E65100)', shape: 'blossom' }
    ];

    for (let i = 0; i < flowerCount; i++) {
      const flower = document.createElement('div');
      flower.className = 'floating-petal';

      const config = flowerTypes[i % flowerTypes.length];
      const size = Math.floor(Math.random() * 12) + 12; // 12px to 24px
      const left = (Math.random() * 98).toFixed(1);
      const fallDur = (Math.random() * 7 + 8).toFixed(1); // 8s to 15s
      const fallDelay = (Math.random() * 12).toFixed(1);
      const driftX = Math.floor(Math.random() * 180 - 90);
      const rotEnd = Math.floor(Math.random() * 720 - 360);

      flower.style.width = `${size}px`;
      flower.style.left = `${left}%`;
      flower.style.setProperty('--fall-dur', `${fallDur}s`);
      flower.style.setProperty('--fall-delay', `${fallDelay}s`);
      flower.style.setProperty('--drift-x', `${driftX}px`);
      flower.style.setProperty('--rot-end', `${rotEnd}deg`);

      if (config.shape === 'rose') {
        flower.style.height = `${Math.floor(size * 1.25)}px`;
        flower.style.borderRadius = '70% 30% 70% 30% / 60% 40% 60% 40%';
        flower.style.background = config.bg;
        flower.style.opacity = '0.82';
      } else if (config.shape === 'blossom') {
        flower.style.height = `${size}px`;
        flower.style.borderRadius = '50%';
        flower.style.background = config.bg;
        flower.style.boxShadow = '0 0 6px rgba(255, 158, 0, 0.4)';
        flower.style.opacity = '0.85';
      } else {
        flower.style.height = `${Math.floor(size * 1.5)}px`;
        flower.style.borderRadius = '50% 50% 50% 0';
        flower.style.background = config.bg;
        flower.style.opacity = '0.85';
      }

      petalsContainer.appendChild(flower);
    }
  }

  // Toggle ambient animations
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isPaused = document.body.classList.toggle('motion-paused');
      toggleBtn.setAttribute('aria-pressed', String(isPaused));
      toggleBtn.title = isPaused ? 'Resume Animations' : 'Pause Animations';

      const icon = toggleBtn.querySelector('.motion-icon');
      if (icon) {
        icon.textContent = isPaused ? '▶' : '⏸';
      }
    });
  }
};
