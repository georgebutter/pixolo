// import { Vector2, vector2 } from "../scalars/vector2";
// import { pointsToPath2D } from "./pointsToPath2D";
// import { rotatePoints } from "./rotatePoints";

// export const drawRectangle = (config?: Config) => {
//   const {
//     x = 0,
//     y = 0,
//     rotation = 0,
//     width = 50,
//     height = 50,
//   } = config ?? {};

//   const points = [
//     vector2(x, y),
//     vector2(x + width, y),
//     vector2(x + width, y + height),
//     vector2(x, y + height),
//   ]
  // const rotatedPoints = rotatePoints(points, rotation, vector2(x + width / 2, y + height / 2));
//   const path = pointsToPath2D(rotatedPoints);

//   return {
//     path,
//     points: rotatedPoints,
//   };
// }

// type Config = Partial<DrawConfig>;

// export type DrawConfig = {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   rotation: number;
// }
