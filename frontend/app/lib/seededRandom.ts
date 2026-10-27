/** Stable pseudo-random value in [0, 1), safe to call during React render. */
export function seededRandom(seed: number): number {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}
