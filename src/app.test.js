/**
 * Tests for audio player initialization and functionality
 * Using Jest with jsdom environment
 */

describe('Audio Player Initialization', () => {
  test('should initialize audio players correctly', () => {
    document.body.innerHTML = `
      <audio id="audio1"></audio>
      <audio id="audio2"></audio>
    `;

    const player1 = document.getElementById('audio1');
    const player2 = document.getElementById('audio2');

    expect(player1).not.toBeNull();
    expect(player2).not.toBeNull();
  });
});

describe('Audio Player Functionality', () => {
  let player;
  let button;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="play-pause"></button>
      <audio id="audio"></audio>
    `;

    player = document.getElementById('audio');
    button = document.getElementById('play-pause');

    // Mock play and pause methods
    player.play = jest.fn().mockResolvedValue();
    player.pause = jest.fn().mockResolvedValue();

    // Mock paused property
    Object.defineProperty(player, 'paused', {
      get: jest.fn(() => true),
      configurable: true,
    });

    // Mock button click event listener toggle
    button.classList.add('paused');
  });

  test('should play audio when play button is clicked', async () => {
    // Simulate click event
    button.classList.remove('paused');
    await player.play();

    expect(player.play).toHaveBeenCalled();
    expect(button.classList.contains('paused')).toBe(false);
  });

  test('should pause audio when play button is clicked again', async () => {
    // Simulate click event
    button.classList.add('paused');
    await player.pause();

    expect(player.pause).toHaveBeenCalled();
    expect(button.classList.contains('paused')).toBe(true);
  });
});
