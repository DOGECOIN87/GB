import * as THREE from 'three';

/**
 * AsteroidSystem - Manages asteroids with glowing crystals that can be destroyed
 */
export class AsteroidSystem {
  constructor(engine) {
    this.engine = engine;
    this.asteroids = [];
    this.crystals = [];
    this.explosions = [];
    this.pool = [];
    this.maxAsteroids = 8;
    this.spawnRate = 0.8; // seconds between spawns
    this.spawnTimer = 0.5; // Start spawning after 0.5 seconds

    // Asteroid geometry and materials
    this.asteroidGeometry = new THREE.DodecahedronGeometry(0.8, 1);
    this.asteroidMaterial = new THREE.MeshStandardMaterial({
      color: 0x666666,
      emissive: 0x222222,
      metalness: 0.4,
      roughness: 0.8
    });

    // Crystal geometry and material
    this.crystalGeometry = new THREE.TetrahedronGeometry(0.3, 0);
    this.crystalMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x00ff88,
      emissiveIntensity: 0.8,
      metalness: 0.8,
      roughness: 0.2
    });
  }

  init() {
    // Pre-populate pool
    console.log('AsteroidSystem init starting, creating', this.maxAsteroids, 'asteroids');
    for (let i = 0; i < this.maxAsteroids; i++) {
      const asteroidMesh = new THREE.Mesh(this.asteroidGeometry, this.asteroidMaterial);
      asteroidMesh.visible = false;
      asteroidMesh.castShadow = true;
      asteroidMesh.receiveShadow = true;

      const crystalMesh = new THREE.Mesh(this.crystalGeometry, this.crystalMaterial);
      crystalMesh.visible = false;
      crystalMesh.castShadow = true;

      this.engine.addToScene(asteroidMesh);
      this.engine.addToScene(crystalMesh);

      this.pool.push({
        asteroid: asteroidMesh,
        crystal: crystalMesh,
        crystalMaterial: this.crystalMaterial,
        active: false,
        health: 1,
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        rotation: new THREE.Vector3(),
        rotationSpeed: new THREE.Vector3(),
        crystalRotation: new THREE.Vector3(),
        crystalRotationSpeed: new THREE.Vector3()
      });
    }
    console.log('AsteroidSystem init complete, pool size:', this.pool.length);
  }

  update(deltaTime) {
    this.spawnTimer += deltaTime;
    if (this.spawnTimer >= this.spawnRate && this.asteroids.length < this.maxAsteroids) {
      this.spawnAsteroid();
      this.spawnTimer = 0;
    }

    // Update asteroids
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const asteroid = this.asteroids[i];
      
      // Move asteroid
      asteroid.position.add(asteroid.velocity.clone().multiplyScalar(deltaTime));
      
      // Update mesh positions
      asteroid.asteroid.position.copy(asteroid.position);
      
      // Rotate asteroid
      asteroid.asteroid.rotation.x += asteroid.rotationSpeed.x * deltaTime;
      asteroid.asteroid.rotation.y += asteroid.rotationSpeed.y * deltaTime;
      asteroid.asteroid.rotation.z += asteroid.rotationSpeed.z * deltaTime;
      
      // Update crystal position and rotation
      asteroid.crystal.position.copy(asteroid.position);
      asteroid.crystalRotation.x += asteroid.crystalRotationSpeed.x * deltaTime;
      asteroid.crystalRotation.y += asteroid.crystalRotationSpeed.y * deltaTime;
      asteroid.crystalRotation.z += asteroid.crystalRotationSpeed.z * deltaTime;
      
      asteroid.crystal.rotation.setFromVector3(asteroid.crystalRotation);
      
      // Pulse crystal glow
      const pulse = 0.6 + 0.4 * Math.sin(Date.now() * 0.003);
      this.crystalMaterial.emissiveIntensity = 0.5 * pulse;

      // Remove if too far away
      if (asteroid.position.z < -25 || 
          Math.abs(asteroid.position.x) > 30 || 
          Math.abs(asteroid.position.y) > 25) {
        this.removeAsteroid(i);
      }
    }

    // Update particle explosions
    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const exp = this.explosions[i];
      exp.lifetime -= deltaTime;
      
      if (exp.lifetime <= 0) {
        this.explosions.splice(i, 1);
        continue;
      }

      // Update particles
      for (const particle of exp.particles) {
        particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime));
        particle.scale.multiplyScalar(0.95); // Shrink particles
        particle.material.opacity -= deltaTime * 2;
      }
    }
  }

  spawnAsteroid() {
    const available = this.pool.find(a => !a.active);
    if (!available) return;

    available.active = true;
    available.health = 1;
    
    console.log('Spawning asteroid, pool active:', this.asteroids.length);
    // Random spawn position (off-screen, coming toward player)
    const side = Math.random();
    let x, y;
    if (side < 0.25) { // Top
      x = (Math.random() - 0.5) * 40;
      y = 20;
    } else if (side < 0.5) { // Bottom
      x = (Math.random() - 0.5) * 40;
      y = -20;
    } else if (side < 0.75) { // Left
      x = -25;
      y = (Math.random() - 0.5) * 30;
    } else { // Right
      x = 25;
      y = (Math.random() - 0.5) * 30;
    }

    available.position.set(x, y, 5 + Math.random() * 25);
    available.asteroid.position.copy(available.position);
    available.crystal.position.copy(available.position);
    available.asteroid.visible = true;
    available.crystal.visible = true;

    // Velocity toward player with some randomness
    const speed = 3 + Math.random() * 2;
    available.velocity.set(
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 3,
      -speed
    );

    // Rotation speeds
    available.rotationSpeed.set(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    );

    available.crystalRotationSpeed.set(
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4
    );

    this.asteroids.push(available);
  }

  checkCollisions(lasers) {
    const laserRange = 0.5;
    const collisions = [];
    
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const asteroid = this.asteroids[i];
      
      for (let j = lasers.length - 1; j >= 0; j--) {
        const laser = lasers[j];
        
        if (!laser.visible) continue; // Skip invisible lasers
        
        const distance = asteroid.position.distanceTo(laser.position);
        if (distance < 1.5) {
          // Hit! Create explosion and remove asteroid
          this.createExplosion(asteroid.position);
          this.removeAsteroid(i);
          collisions.push({ asteroidIndex: i, laserIndex: j });
          break; // Only one hit per asteroid per frame
        }
      }
    }
    
    return collisions.length > 0 ? collisions[0] : null;
  }

  createExplosion(position) {
    const particleCount = 12;
    const particles = [];
    const particleGeometry = new THREE.SphereGeometry(0.1, 4, 4);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 1
    });

    for (let i = 0; i < particleCount; i++) {
      const particle = new THREE.Mesh(particleGeometry, material);
      particle.position.copy(position);
      
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 10 + Math.random() * 5;
      particle.velocity = new THREE.Vector3(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed + Math.random() * 5,
        -Math.random() * 5
      );

      this.engine.addToScene(particle);
      particles.push(particle);
    }

    this.explosions.push({
      particles,
      lifetime: 0.8
    });
  }

  removeAsteroid(index) {
    if (index < 0 || index >= this.asteroids.length) return;
    
    const asteroid = this.asteroids[index];
    asteroid.active = false;
    asteroid.asteroid.visible = false;
    asteroid.crystal.visible = false;
    this.asteroids.splice(index, 1);
  }

  getAsteroids() {
    return this.asteroids;
  }

  dispose() {
    this.asteroidGeometry.dispose();
    this.asteroidMaterial.dispose();
    this.crystalGeometry.dispose();
    this.crystalMaterial.dispose();
    this.asteroids = [];
    this.pool = [];
  }
}

export default AsteroidSystem;
