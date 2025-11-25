
/**
 * Returns a random number between min and max inclusive
 * @param {number} min 
 * @param {number} max 
 * @returns {number} - Random number between min and max
 */
export const randomRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


export const randomFloatRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}