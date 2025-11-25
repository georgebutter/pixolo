import { Vector2 } from "../scalars/vector2";


export const intersects = (a: Array<Vector2>, b: Array<Vector2>) => {
  const aMin = a.reduce((min, p) => {
    return {
      x: Math.min(min.x, p.x),
      y: Math.min(min.y, p.y),
    }
  }, { x: Infinity, y: Infinity });
  const aMax = a.reduce((max, p) => {
    return {
      x: Math.max(max.x, p.x),
      y: Math.max(max.y, p.y),
    }
  }, { x: -Infinity, y: -Infinity });
  const bMin = b.reduce((min, p) => {
    return {
      x: Math.min(min.x, p.x),
      y: Math.min(min.y, p.y),
    }
  }, { x: Infinity, y: Infinity });
  const bMax = b.reduce((max, p) => {
    return {
      x: Math.max(max.x, p.x),
      y: Math.max(max.y, p.y),
    }
  }, { x: -Infinity, y: -Infinity });

  return aMin.x < bMax.x && aMax.x > bMin.x && aMin.y < bMax.y && aMax.y > bMin.y;
}