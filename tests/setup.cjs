require('@testing-library/jest-dom');

// Mock Audio element since jsdom doesn't support it
window.HTMLMediaElement.prototype.load = () => { /* do nothing */ };
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => Promise.resolve();
window.HTMLMediaElement.prototype.addTextTrack = () => { /* do nothing */ };

// Mock window.scrollTo
window.scrollTo = jest.fn();
