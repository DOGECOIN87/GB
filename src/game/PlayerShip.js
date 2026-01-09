import * as THREE from 'three';

/**
 * PlayerShip - Handles player ship movement, physics, and animations
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 7.1, 7.2, 7.3, 7.4, 7.5
 */
export class PlayerShip {
  constructor(engine, model) {
    this.engine = engine;
    this.model = model;
    this.input = engine.getSystem('input');
    
    this.velocity = new THREE.Vector3();
    this.acceleration = 20;
    this.deceleration = 0.95;
    this.maxSpeed = 15;
    
    this.rotationSpeed = 2;
    this.tiltAmount = 0.5;
    this.tiltSpeed = 5;
    
    // Barrel roll state
    this.isRolling = false;
    this.rollDirection = 0; // 1 for right, -1 for left
    this.rollProgress = 0;
    this.rollDuration = 0.6; // seconds
    this.rollCooldown = 0;
    this.rollCooldownTime = 1.0;
    
    // World boundaries
    this.bounds = {
      x: 20,
      y: 15
    };

    this._init();
  }

  _init() {
    if (this.input) {
      this.input.onDoubleTap('KeyA', () => this.startBarrelRoll(-1));
      this.input.onDoubleTap('ArrowLeft', () => this.startBarrelRoll(-1));
      this.input.onDoubleTap('KeyD', () => this.startBarrelRoll(1));
      this.input.onDoubleTap('ArrowRight', () => this.startBarrelRoll(1));
    }
  }

  startBarrelRoll(direction) {
    if (this.isRolling || this.rollCooldown > 0) return false;

    this.isRolling = true;
    this.rollDirection = direction;
    this.rollProgress = 0;
    return true;
  }

  // Trigger barrel roll in a random direction (for B button)
  triggerBarrelRoll() {
    // Alternate direction based on velocity or just pick one
    const direction = this.velocity.x >= 0 ? 1 : -1;
    return this.startBarrelRoll(direction);
  }

  update(deltaTime) {
    this._handleMovement(deltaTime);
    this._handleRotation(deltaTime);
    this._handleBarrelRoll(deltaTime);
    this._applyPhysics(deltaTime);
    this._constrainToBounds();
    
    if (this.rollCooldown > 0) {
      this.rollCooldown -= deltaTime;
    }
  }

  _handleMovement(deltaTime) {
    if (!this.input) return;

    const moveForce = new THREE.Vector3();

    if (this.input.isKeyDown('KeyW') || this.input.isKeyDown('ArrowUp')) moveForce.y += 1;
    if (this.input.isKeyDown('KeyS') || this.input.isKeyDown('ArrowDown')) moveForce.y -= 1;
    if (this.input.isKeyDown('KeyA') || this.input.isKeyDown('ArrowLeft')) moveForce.x -= 1;
    if (this.input.isKeyDown('KeyD') || this.input.isKeyDown('ArrowRight')) moveForce.x += 1;
    
    if (moveForce.length() > 0) {
      moveForce.normalize().multiplyScalar(this.acceleration * deltaTime);
      this.velocity.add(moveForce);
    }
    
    // Cap speed
    if (this.velocity.length() > this.maxSpeed) {
      this.velocity.setLength(this.maxSpeed);
    }
    
    // Apply friction/deceleration
    this.velocity.multiplyScalar(this.deceleration);
  }

  _handleRotation(deltaTime) {
    if (!this.model || !this.input) return;

    // Target rotation based on mouse position
    const targetRotX = -this.input.mouse.y * 0.5;
    const targetRotY = -this.input.mouse.x * 0.5;
    
    // Smoothly interpolate rotation
    this.model.rotation.x = THREE.MathUtils.lerp(this.model.rotation.x, targetRotX, deltaTime * this.rotationSpeed);
    this.model.rotation.y = THREE.MathUtils.lerp(this.model.rotation.y, targetRotY, deltaTime * this.rotationSpeed);
    
    // Add tilt based on horizontal movement
    const targetTilt = -this.velocity.x * this.tiltAmount * 0.1;
    this.model.rotation.z = THREE.MathUtils.lerp(this.model.rotation.z, targetTilt, deltaTime * this.tiltSpeed);
  }

  _handleBarrelRoll(deltaTime) {
    if (!this.isRolling || !this.model) return;
    
    this.rollProgress += deltaTime / this.rollDuration;
    
    if (this.rollProgress >= 1) {
      this.isRolling = false;
      this.rollProgress = 0;
      this.rollCooldown = this.rollCooldownTime;
      this.model.rotation.z = 0; // Reset
    } else {
      // Apply 360 degree rotation
      const rollAngle = this.rollProgress * Math.PI * 2 * -this.rollDirection;
      this.model.rotation.z = rollAngle;
    }
  }

  _applyPhysics(deltaTime) {
    if (!this.model) return;
    
    this.model.position.x += this.velocity.x * deltaTime;
    this.model.position.y += this.velocity.y * deltaTime;
  }

  _constrainToBounds() {
    if (!this.model) return;
    
    if (Math.abs(this.model.position.x) > this.bounds.x) {
      this.model.position.x = Math.sign(this.model.position.x) * this.bounds.x;
      this.velocity.x = 0;
    }
    
    if (Math.abs(this.model.position.y) > this.bounds.y) {
      this.model.position.y = Math.sign(this.model.position.y) * this.bounds.y;
      this.velocity.y = 0;
    }
  }
}

export default PlayerShip;
