/**
 * Lightweight animation system that hooks into PixiJS's ticker.
 * Interpolates properties on a target object over a duration with easing.
 */

const active = [];

/**
 * Start a new animation.
 * @param {object} opts
 * @param {object}   opts.target     - Object whose properties will be animated
 * @param {object}   opts.from       - Starting property values
 * @param {object}   opts.to         - Ending property values
 * @param {number}   opts.duration   - Duration in milliseconds
 * @param {function} [opts.easing]   - Easing function (default: easeOutQuad)
 * @param {function} [opts.onUpdate] - Called each frame with eased progress (0–1)
 * @param {function} [opts.onComplete] - Called when animation finishes
 */
export function animate({ target, from, to, duration, easing, onUpdate, onComplete }) {
  // Apply initial values immediately
  if (target && from) {
    for (const key in from) target[key] = from[key];
  }

  active.push({
    target,
    from: from ? { ...from } : null,
    to: to ? { ...to } : null,
    duration,
    elapsed: 0,
    easing: easing ?? easeOutQuad,
    onUpdate: onUpdate ?? null,
    onComplete: onComplete ?? null,
  });
}

/**
 * Advance all active animations. Call from your PixiJS ticker callback.
 * @param {number} deltaMS - Milliseconds since last frame
 */
export function updateAnimations(deltaMS) {
  for (let i = active.length - 1; i >= 0; i--) {
    const anim = active[i];
    anim.elapsed += deltaMS;
    const rawT = Math.min(anim.elapsed / anim.duration, 1);
    const t = anim.easing(rawT);

    // Interpolate target properties
    if (anim.target && anim.from && anim.to) {
      for (const key in anim.to) {
        anim.target[key] = anim.from[key] + (anim.to[key] - anim.from[key]) * t;
      }
    }

    if (anim.onUpdate) anim.onUpdate(t, rawT);

    if (rawT >= 1) {
      if (anim.onComplete) anim.onComplete();
      active.splice(i, 1);
    }
  }
}

// ─── Easing functions ───

export function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t);
}

export function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export function easeOutElastic(t) {
  if (t === 0 || t === 1) return t;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
}

export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
