import { GameObject, GameObjectConfig } from ".";
import { Vector2 } from "../scalars/vector2";

export interface VerletGameObject {
  applyConstraint?(): void;
}

export class VerletGameObject extends GameObject {
  public acceleration: Vector2 = new Vector2(0, 0);
  public gravity: Vector2 = new Vector2(0, 981);
  public velocity: Vector2 = new Vector2(0, 0);
  /** value between 0 and 1, controlling how much the object slows down when in contact with a constraint */
  public damping: number = 0.3;
  /** value between 0 and 1, 0 meaning no bounce and 1 meaning bounces with same amount of energy */
  public bounceFactor: number = 0.5;
  public previousPosition: Vector2 | undefined = undefined;

  constructor({name = "Verlet", ...config}: GameObjectConfig) {
    super({name, ...config});
  }
  
  physicsUpdate(deltaTime: number) {
    this.applyGravity();
    this.updatePosition(deltaTime);
    this.applyConstraint?.();
  }

  applyGravity() {
    if (this.gravity.y === 0) return;
    this.accelerate(this.gravity);
  }

  applyForce(force: Vector2) {
    this.accelerate(force);
  }

  applyMagneticForce(attractorPoint: Vector2, strength: number): void {
    const toAttractor = attractorPoint.subtract(this.position);
    const distance = toAttractor.length();
    
    // 1. Early exit if too close to prevent extreme forces
    const minDistance = 10; // Adjust based on your game's scale
    if (distance < minDistance) return;
    
    // 2. Calculate base force with smoother falloff
    const forceMagnitude = strength * (1 / (1 + distance * distance));
    
    // 3. Add maximum force clamp
    const maxForce = 500; // Adjust based on your needs
    const clampedForce = Math.min(forceMagnitude, maxForce);
    
    // 4. Apply velocity dampening when moving towards target
    const direction = toAttractor.normalize();
    const currentVelocity = this.velocity.length();
    
    // Check if we're moving towards the target
    const dotProduct = this.velocity.dot(direction);
    
    // 5. Apply speed limiting
    const maxSpeed = 400; // Maximum allowed speed
    if (currentVelocity > maxSpeed) {
        this.velocity = this.velocity.normalize().scale(maxSpeed);
    }
    
    // 6. Calculate final force with dampening
    let finalForce = direction.scale(clampedForce);
    
    // If moving towards target, apply extra dampening
    if (dotProduct > 0) {
        const velocityTowardsTarget = dotProduct / currentVelocity;
        const dampening = Math.max(0, 1 - (velocityTowardsTarget * currentVelocity / maxSpeed));
        finalForce = finalForce.scale(dampening);
    }
    
    this.velocity = this.velocity.add(finalForce);
  }

  updatePosition(dt: number) {
    // Apply damping to velocity
    this.velocity = this.velocity.scale(1 - this.damping * dt);

    // Verlet Integration
    this.previousPosition = this.position;
    this.position = this.position.add(this.velocity.scale(dt)).add(this.acceleration.scale(0.5 * dt * dt));
    this.velocity = this.position.subtract(this.previousPosition).scale(1 / dt);
    // Reset acceleration
    this.acceleration = new Vector2(0, 0);
  }

  accelerate(acceleration: Vector2) {
    this.acceleration = this.acceleration.add(acceleration);
  }
}