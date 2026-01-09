import * as THREE from 'three';

/**
 * DockingSystem - Manages docking stations and coin securing
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */
export class DockingSystem {
  constructor(engine) {
    this.engine = engine;
    this.stations = [];
    this.dockingRange = 3.0;
    this.spawnInterval = 15.0; // Less frequent than coins
    this.spawnTimer = 0;
    this.playerShip = null; // Store player reference

    this.stationGeometry = new THREE.TorusGeometry(2, 0.2, 16, 100);
    this.stationMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.7
    });

    this.onDockingPossible = null;
    this.onDockingComplete = null;
  }

  setPlayer(playerShip) {
    this.playerShip = playerShip;
  }

  init() {
    // Initial spawn timer
    this.spawnTimer = 10; 
  }

  update(deltaTime) {
    this.spawnTimer += deltaTime;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnStation();
      this.spawnTimer = 0;
    }

    let dockingAvailable = false;

    for (let i = this.stations.length - 1; i >= 0; i--) {
      const station = this.stations[i];

      // Move station towards player
      station.position.z += deltaTime * 8;
      station.rotation.z += deltaTime * 0.5;

      // Check for docking proximity
      if (this.playerShip && this.playerShip.model) {
        const distance = station.position.distanceTo(this.playerShip.model.position);
        if (distance < this.dockingRange) {
          dockingAvailable = true;

          // Auto-dock if close enough or if player presses a key (simplified to auto-dock for now)
          if (distance < 1.0) {
            this.completeDocking(i);
            continue;
          }
        }
      }

      // Remove if passed player
      if (station.position.z > 10) {
        this.removeStation(i);
      }
    }

    if (this.onDockingPossible) {
      this.onDockingPossible(dockingAvailable);
    }
  }

  spawnStation() {
    const station = new THREE.Mesh(this.stationGeometry, this.stationMaterial);
    station.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 8,
      -60
    );
    this.engine.addToScene(station);
    this.stations.push(station);
  }

  completeDocking(index) {
    const station = this.stations[index];
    this.engine.removeFromScene(station);
    this.stations.splice(index, 1);
    
    if (this.onDockingComplete) {
      this.onDockingComplete();
    }
    
    console.log('Docking complete! Coins secured.');
  }

  removeStation(index) {
    const station = this.stations[index];
    this.engine.removeFromScene(station);
    this.stations.splice(index, 1);
  }

  dispose() {
    this.stationGeometry.dispose();
    this.stationMaterial.dispose();
    this.stations.forEach(s => this.engine.removeFromScene(s));
    this.stations = [];
  }
}

export default DockingSystem;
