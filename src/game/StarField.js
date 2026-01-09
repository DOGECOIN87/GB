import * as THREE from 'three';

/**
 * StarField - Creates flying stars effect as if traveling through space
 */
export class StarField {
  constructor(engine) {
    this.engine = engine;
    this.stars = [];
    this.starCount = 200;
    this.speed = 15; // How fast stars move toward camera

    // Material for stars
    this.starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.15,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8
    });
  }

  init() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.starCount * 3);
    const velocities = new Float32Array(this.starCount * 3);

    for (let i = 0; i < this.starCount; i++) {
      const i3 = i * 3;
      
      // Random position in a box around the camera
      positions[i3] = (Math.random() - 0.5) * 80;
      positions[i3 + 1] = (Math.random() - 0.5) * 60;
      positions[i3 + 2] = (Math.random() - 0.5) * 100 - 50;

      // Velocity (mostly toward camera along Z)
      velocities[i3] = (Math.random() - 0.5) * 2;
      velocities[i3 + 1] = (Math.random() - 0.5) * 2;
      velocities[i3 + 2] = this.speed;

      this.stars.push({
        velocityX: velocities[i3],
        velocityY: velocities[i3 + 1],
        velocityZ: velocities[i3 + 2],
        originalZ: positions[i3 + 2]
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starPoints = new THREE.Points(geometry, this.starMaterial);
    this.starGeometry = geometry;
    this.starPoints = starPoints;
    
    this.engine.addToScene(starPoints);
  }

  update(deltaTime) {
    const positions = this.starGeometry.attributes.position.array;

    for (let i = 0; i < this.starCount; i++) {
      const i3 = i * 3;
      const star = this.stars[i];

      // Update positions
      positions[i3] += star.velocityX * deltaTime;
      positions[i3 + 1] += star.velocityY * deltaTime;
      positions[i3 + 2] += star.velocityZ * deltaTime;

      // Reset stars that pass the camera
      if (positions[i3 + 2] > 10) {
        positions[i3] = (Math.random() - 0.5) * 80;
        positions[i3 + 1] = (Math.random() - 0.5) * 60;
        positions[i3 + 2] = -100;
        
        star.velocityX = (Math.random() - 0.5) * 2;
        star.velocityY = (Math.random() - 0.5) * 2;
        star.velocityZ = this.speed;
      }
    }

    this.starGeometry.attributes.position.needsUpdate = true;
  }

  dispose() {
    this.starGeometry.dispose();
    this.starMaterial.dispose();
    this.stars = [];
  }
}

export default StarField;
