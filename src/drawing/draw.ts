import { Vector2 } from "../scalars/vector2";
import { paint } from "./paint";
import { drawRectangle, Shape } from "./rectangle";

// const drawWrapped = <T>(object: GameObject<T>): Array<Shape> => {
//   const {
//     getWidth,
//     getHeight,
//     getPosition,
//     getRotation,
//     game,
//   } = object;
//   const canW = game.getWidth();
//   const canH = game.getHeight();
//   const pos = getPosition();
//   const vals = {
//     width: getWidth(),
//     height: getHeight(),
//     rotation: getRotation(),
//   }
//   const needsWrapping = pos.x < vals.width / 2 || pos.y < vals.height / 2 || pos.x + getWidth() > canW || pos.y + getHeight() > canH;
//   if (!needsWrapping) {
//     return [];
//   }
//   const paths = [];
//   if (pos.x < vals.width / 2) {
//     const path = drawRectangle({
//       x: canW + pos.x,
//       y: pos.y,
//       ...vals
//     });
//     paths.push(path);
//   }
//   if (pos.y < vals.height / 2) {
//     const path = drawRectangle({
//       x: pos.x,
//       y: canH + pos.y,
//       ...vals
//     });
//     paths.push(path);
//   }
//   if (pos.x + getWidth() > canW) {
//     const path = drawRectangle({
//       x: pos.x - canW,
//       y: pos.y,
//       ...vals
//     });
//     paths.push(path);
//   }
//   if (pos.y + getHeight() > canH) {
//     const path = drawRectangle({
//       x: pos.x,
//       y: pos.y - canH,
//       ...vals
//     });
//     paths.push(path);
//   }
//   if (pos.x < 0 && pos.y < 0) {
//     const path = drawRectangle({
//       x: canW + pos.x,
//       y: canH + pos.y,
//       ...vals
//     });
//     paths.push(path);
//   }
//   if (pos.x + getWidth() > canW && pos.y + getHeight() > canH) {
//     const path = drawRectangle({
//       x: pos.x - canW,
//       y: pos.y - canH,
//       ...vals
//     });
//     paths.push(path);
//   }
//   if (pos.x < 0 && pos.y + getHeight() > canH) {
//     const path = drawRectangle({
//       x: canW + pos.x,
//       y: pos.y - canH,
//       ...vals
//     });
//     paths.push(path);
//   }
//   if (pos.x + getWidth() > canW && pos.y < 0) {
//     const path = drawRectangle({
//       x: pos.x - canW,
//       y: canH + pos.y,
//       ...vals
//     });
//     paths.push(path);
//   }

//   return paths;
// }

// export const draw = <T>(object: GameObject<T>): Array<Shape> => {
//   const {
//     getWidth,
//     getHeight,
//     getPosition,
//     getRotation,
//     getFill,
//     game,
//     layer,
//   } = object;
//   const pos = getPosition();
//   const path = drawRectangle({
//     ...pos,
//     width: getWidth(),
//     height: getHeight(),
//     rotation: getRotation(),
//   });
//   const wrappedPaths = drawWrapped(object);
//   layer.addDrawCall(() => {
//     const style = {
//       context: game.context(),
//       fill: getFill(),
//     }
//     wrappedPaths.forEach((path) =>
//       paint({
//         ...style,
//         path: path.path,
//       })
//     );
//     paint({
//       ...style,
//       path: path.path,
//     })
//   });
//   return [path, ...wrappedPaths];
// }