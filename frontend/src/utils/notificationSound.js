// Web Audio API Sound Generator & Native Browser Notification Helper

export function playNotificationSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Tone 1 - D5 (587.33 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Tone 2 - A5 (880 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.0, now + 0.15);
    gain2.gain.setValueAtTime(0.35, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.55);
  } catch (e) {
    console.log("Audio notification error:", e);
  }
}

export function triggerPickupNotification(pickup) {
  // 1. Play audio chime sound
  playNotificationSound();

  // 2. Request & Send Native Desktop Notification if supported
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification('🔔 New Waste Pickup Offered!', {
        body: `Pickup #${pickup.pickup_id || pickup.id} nearby (${pickup.distance_km ? pickup.distance_km + ' km' : 'Location pinned'}). Tap to respond!`,
        icon: '/manifest.webmanifest',
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('🔔 New Waste Pickup Offered!', {
            body: `Pickup #${pickup.pickup_id || pickup.id} nearby. Tap to respond!`,
          });
        }
      });
    }
  }
}
