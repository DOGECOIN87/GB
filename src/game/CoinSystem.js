import * as THREE from 'three';

/**
 * CoinSystem - Manages coin spawning, animation, and collection
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */
export class CoinSystem {
  constructor(engine) {
    this.engine = engine;
    this.coins = [];
    this.pool = [];
    this.maxCoins = 10;
    this.spawnInterval = 2.0;
    this.spawnTimer = 0;
    
    this.bounds = {
      x: 18,
      y: 13,
      z: -50 // Spawn distance
    };
    
    this.coinGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
    this.coinMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffd700, 
      metalness: 0.8, 
      roughness: 0.2,
      emissive: 0xffd700,
      emissiveIntensity: 0.2
    });
    
    this.onCoinCollected = null;
  }

  init() {
    // Pre-populate pool
    for (let i = 0; i < this.maxCoins; i++) {
      const coin = new THREE.Mesh(this.coinGeometry, this.coinMaterial);
      coin.rotation.x = Math.PI / 2;
      coin.visible = false;
      this.pool.push(coin);
      this.engine.addToScene(coin);
    }
  }

  update(deltaTime, playerShip) {
    this.spawnTimer += deltaTime;
    if (this.spawnTimer >= this.spawnInterval && this.coins.length < this.maxCoins) {
      this.spawnCoin();
      this.spawnTimer = 0;
    }

    // Update existing coins
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const coin = this.coins[i];
      
      // Rotate coin
      coin.rotation.z += deltaTime * 3;
      
      // Move coin towards player (scrolling effect)
      coin.position.z += deltaTime * 10;
      
      // Check for collection
      if (playerShip && playerShip.model) {
        const distance = coin.position.distanceTo(playerShip.model.position);
        if (distance < 1.5) {
          this.collectCoin(i);
          continue;
        }
      }
      
      // Remove if passed player
      if (coin.position.z > 10) {
        this.removeCoin(i);
      }
    }
  }

  spawnCoin() {
    const coin = this.pool.find(c => !c.visible);
    if (coin) {
      coin.position.set(
        (Math.random() - 0.5) * this.bounds.x * 2,
        (Math.random() - 0.5) * this.bounds.y * 2,
        this.bounds.z
      );
      coin.visible = true;
      this.coins.push(coin);
    }
  }

  collectCoin(index) {
    const coin = this.coins[index];
    coin.visible = false;
    this.coins.splice(index, 1);
    
    if (this.onCoinCollected) {
      this.onCoinCollected();
    }
    
    // Add visual feedback (could be a particle effect)
    console.log('Coin collected!');
  }

  removeCoin(index) {
    const coin = this.coins[index];
    coin.visible = false;
    this.coins.splice(index, 1);
  }

  dispose() {
    this.coinGeometry.dispose();
    this.coinMaterial.dispose();
    this.coins = [];
    this.pool = [];
  }
}

export default CoinSystem;
