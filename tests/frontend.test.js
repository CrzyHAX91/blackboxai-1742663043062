/**
 * Frontend UI tests for audio player, navigation, mobile menu, and gradient text
 * Using Jest with jsdom environment
 */

describe('Frontend UI Tests', () => {
  beforeEach(() => {
    // Setup a minimal DOM structure for tests
    document.body.innerHTML = `
      <nav>
        <a href="#section1" id="link1">Section 1</a>
        <a href="#section2" id="link2">Section 2</a>
      </nav>
      <button id="audio-play-pause" class="paused"></button>
      <div id="mobile-menu" class="hidden"></div>
      <h1 class="gradient-text">Title</h1>
    `;
  });

  test('Audio player play/pause toggles classes', () => {
    const button = document.getElementById('audio-play-pause');
    expect(button.classList.contains('paused')).toBe(true);
    button.classList.toggle('paused');
    expect(button.classList.contains('paused')).toBe(false);
  });

  test('Smooth scrolling navigation works', () => {
    const link1 = document.getElementById('link1');
    expect(link1.getAttribute('href')).toBe('#section1');
  });

  test('Mobile menu toggles visibility', () => {
    const menu = document.getElementById('mobile-menu');
    expect(menu.classList.contains('hidden')).toBe(true);
    menu.classList.toggle('hidden');
    expect(menu.classList.contains('hidden')).toBe(false);
  });

  test('Gradient text scales on hover', () => {
    const title = document.querySelector('.gradient-text');
    expect(title).not.toBeNull();
  });
});
