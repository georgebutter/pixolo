export class Vector2 {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }
  subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }
  multiply(other: Vector2): Vector2 {
    return new Vector2(this.x * other.x, this.y * other.y);
  }
  divide(scalar: number): Vector2 {
    return new Vector2(this.x / scalar, this.y / scalar);
  }
  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  normalize(): Vector2 {
    return new Vector2(this.x / this.magnitude(), this.y / this.magnitude());
  }
  scale(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }
  dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
}
  distance(other: Vector2): number {
    return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
  }
  length(): number {
    return Math.sqrt(this.length2());
  }
  /**
   * @returns the length of the vector squared
   */
  length2(): number {
    return this.x * this.x + this.y * this.y;
  }
  lengthY(): number {
    return Math.sqrt(this.lengthY2());
  }
  lengthY2(): number {
    return this.y * this.y;
  }
}
