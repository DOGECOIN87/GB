import * as THREE from 'three';

/**
 * LaserSystem - Manages laser projectiles and firing mechanics
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */
export class LaserSystem {
  constructor(engine) {
    this.engine = engine;
    this.lasers = [];
    this.pool = [];
    this.maxLasers = 20;
    this.fireRate = 0.2; // seconds between shots
    this.fireTimer = 0;
    
    this.laserGeometry = new THREE.CapsuleGeometry(0.05, 0.5, 4, 8);
    this.laserMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ff88,
      transparent: true,
      opacity: 0.8
    });
  }

  init() {
    // Pre-populate pool
    for (let i = 0; i < this.maxLasers; i++) {
      const laser = new THREE.Mesh(this.laserGeometry, this.laserMaterial);
      laser.rotation.x = Math.PI / 2;
      laser.visible = false;
      this.pool.push(laser);
      this.engine.addToScene(laser);
    }
  }

  update(deltaTime) {
    if (this.fireTimer > 0) {
      this.fireTimer -= deltaTime;
    }

    // Update existing lasers
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const laser = this.lasers[i];

      // Move laser forward
      laser.position.z -= deltaTime * 50;

      // Remove if too far
      if (laser.position.z < -100) {
        this.removeLaser(i);
      }
    }
  }

  fire(position) {
    if (this.fireTimer > 0) return;
    
    const laser = this.pool.find(l => !l.visible);
    if (laser) {
      laser.position.copy(position);
      laser.visible = true;
      this.lasers.push(laser);
      this.fireTimer = this.fireRate;
      
      // Add muzzle flash effect (simplified)
      console.log('Laser fired!');
    }
  }

  removeLaser(index) {
    const laser = this.lasers[index];
    laser.visible = false;
    this.lasers.splice(index, 1);
  }

  dispose() {
    this.laserGeometry.dispose();
    this.laserMaterial.dispose();
    this.lasers = [];
    this.pool = [];
  }
}

export default LaserSystem;
