import * as THREE from 'three';

/**
 * AsteroidSystem - Manages asteroids with glowing crystals that can be destroyed
 * Fixed memory leaks and improved particle management
 */
export class AsteroidSystem {
  constructor(engine) {
    this.engine = engine;
    this.asteroids = [];
    this.explosions = [];
    this.pool = [];
    this.maxAsteroids = 6;
    this.spawnRate = 1.5; // seconds between spawns
    this.spawnTimer = 1.0; // Start spawning after 1 second
    this.player = null;

    // Callbacks
    this.onAsteroidDestroyed = null;
    this.onPlayerHit = null;

    // Asteroid geometry and materials (shared)
    this.asteroidGeometry = new THREE.DodecahedronGeometry(0.8, 1);
    this.asteroidMaterial = new THREE.MeshStandardMaterial({
      color: 0x666666,
      emissive: 0x222222,
      metalness: 0.4,
      roughness: 0.8
    });

    // Crystal geometry and material (shared)
    this.crystalGeometry = new THREE.TetrahedronGeometry(0.3, 0);
    this.crystalMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x00ff88,
      emissiveIntensity: 0.8,
      metalness: 0.8,
      roughness: 0.2
    });

    // Shared particle geometry and material for explosions (reusable)
    this.particleGeometry = new THREE.SphereGeometry(0.1, 4, 4);
    this.particleMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 1
    });

    // Particle pool for explosions
    this.particlePool = [];
    this.maxParticles = 60; // 5 explosions * 12 particles each
  }

  setPlayer(player) {
    this.player = player;
  }

  init() {
    // Pre-populate asteroid pool
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

    // Pre-populate particle pool
    for (let i = 0; i < this.maxParticles; i++) {
      const particle = new THREE.Mesh(this.particleGeometry, this.particleMaterial.clone());
      particle.visible = false;
      particle.userData.velocity = new THREE.Vector3();
      particle.userData.active = false;
      this.engine.addToScene(particle);
      this.particlePool.push(particle);
    }
  }

  update(deltaTime) {
    // Spawn new asteroids
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

      // Check player collision
      if (this.player && this.player.model) {
        const playerPos = this.player.model.position;
        const distance = asteroid.position.distanceTo(playerPos);
        if (distance < 1.8) {
          // Player hit!
          if (this.onPlayerHit) {
            this.onPlayerHit();
          }
          this.createExplosion(asteroid.position.clone());
          this.removeAsteroid(i);
          continue;
        }
      }

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
        // Return particles to pool
        for (const particle of exp.particles) {
          particle.visible = false;
          particle.userData.active = false;
        }
        this.explosions.splice(i, 1);
        continue;
      }

      // Update particles
      const alpha = exp.lifetime / exp.maxLifetime;
      for (const particle of exp.particles) {
        particle.position.add(particle.userData.velocity.clone().multiplyScalar(deltaTime));
        particle.scale.setScalar(alpha * 0.5);
        particle.material.opacity = alpha;
      }
    }
  }

  spawnAsteroid() {
    const available = this.pool.find(a => !a.active);
    if (!available) return;

    available.active = true;
    available.health = 1;
    
    // Random spawn position (off-screen, coming toward player)
    const side = Math.random();
    let x, y;
    if (side < 0.25) { // Top
      x = (Math.random() - 0.5) * 30;
      y = 18;
    } else if (side < 0.5) { // Bottom
      x = (Math.random() - 0.5) * 30;
      y = -18;
    } else if (side < 0.75) { // Left
      x = -22;
      y = (Math.random() - 0.5) * 25;
    } else { // Right
      x = 22;
      y = (Math.random() - 0.5) * 25;
    }

    available.position.set(x, y, 5 + Math.random() * 20);
    available.asteroid.position.copy(available.position);
    available.crystal.position.copy(available.position);
    available.asteroid.visible = true;
    available.crystal.visible = true;

    // Velocity toward center/player with some randomness
    const targetX = (Math.random() - 0.5) * 10;
    const targetY = (Math.random() - 0.5) * 8;
    const direction = new THREE.Vector3(targetX - x, targetY - y, -15).normalize();
    const speed = 4 + Math.random() * 3;
    available.velocity.copy(direction).multiplyScalar(speed);

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
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const asteroid = this.asteroids[i];
      
      for (let j = lasers.length - 1; j >= 0; j--) {
        const laser = lasers[j];
        
        if (!laser.visible) continue;
        
        const distance = asteroid.position.distanceTo(laser.position);
        if (distance < 1.5) {
          // Hit! Create explosion and remove asteroid
          this.createExplosion(asteroid.position.clone());
          this.removeAsteroid(i);
          
          if (this.onAsteroidDestroyed) {
            this.onAsteroidDestroyed();
          }
          
          return { asteroidIndex: i, laserIndex: j };
        }
      }
    }
    
    return null;
  }

  createExplosion(position) {
    const particleCount = 10;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      // Get particle from pool
      const particle = this.particlePool.find(p => !p.userData.active);
      if (!particle) continue;

      particle.userData.active = true;
      particle.visible = true;
      particle.position.copy(position);
      particle.scale.setScalar(0.5);
      particle.material.opacity = 1;
      
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 8 + Math.random() * 4;
      particle.userData.velocity.set(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed + Math.random() * 3,
        -Math.random() * 3
      );

      particles.push(particle);
    }

    if (particles.length > 0) {
      this.explosions.push({
        particles,
        lifetime: 0.6,
        maxLifetime: 0.6
      });
    }
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
    this.particleGeometry.dispose();
    this.particleMaterial.dispose();
    
    // Dispose cloned particle materials
    for (const particle of this.particlePool) {
      if (particle.material) {
        particle.material.dispose();
      }
    }
    
    this.asteroids = [];
    this.pool = [];
    this.particlePool = [];
    this.explosions = [];
  }
}

export default AsteroidSystem;
