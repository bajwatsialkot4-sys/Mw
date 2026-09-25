/**
 * Synthetic Luxury Chime for Real-Time New Order Notifications
 * Uses native Web Audio API - no external assets or network latency needed.
 */
export const playOrderNotificationSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Harmonic chime chords (Bell-like crystal sound)
    const notes = [
      { freq: 587.33, start: 0.0, duration: 0.8 }, // D5
      { freq: 880.00, start: 0.12, duration: 0.9 }, // A5
      { freq: 1174.66, start: 0.24, duration: 1.2 }, // D6
      { freq: 1760.00, start: 0.36, duration: 1.4 }, // A6
    ];

    notes.forEach(({ freq, start, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + start);

      // Attack and gentle exponential decay
      gain.gain.setValueAtTime(0.001, now + start);
      gain.gain.exponentialRampToValueAtTime(0.18, now + start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + start);
      osc.stop(now + start + duration);
    });
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
};
