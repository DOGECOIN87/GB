import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * GameEngine - Core game engine with Three.js scene management and game loop
 * Handles rendering, update cycles, and system coordination
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */
export class GameEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = {
      targetFPS: 60,
      antialias: true,
      alpha: true,
      ...options
    };

    // Core Three.js components
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.gltfLoader = null;

    // Game loop state
    this.isRunning = false;
    this.isPaused = false;
    this.animationFrameId = null;
    this.lastTime = 0;
    this.deltaTime = 0;
    this.elapsedTime = 0;

    // Performance tracking
    this.frameCount = 0;
    this.fps = 0;
    this.fpsUpdateInterval = 1000; // Update FPS every second
    this.lastFpsUpdate = 0;

    // Game systems registry
    this.systems = new Map();

    // Event callbacks
    this.onUpdate = null;
    this.onRender = null;
    this.onResize = null;

    // Bound methods for event listeners
    this._boundResize = this._handleResize.bind(this);
    this._boundGameLoop = this._gameLoop.bind(this);
  }

  /**
   * Initialize the game engine
   * Sets up Three.js scene, camera, renderer, and lighting
   */
  initialize() {
    if (!this.canvas) {
      throw new Error('GameEngine: Canvas element is required');
    }

    const container = this.canvas.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create scene
    this.scene = new THREE.Scene();

    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      width / height,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: this.options.alpha,
      antialias: this.options.antialias
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Initialize GLTF loader
    this.gltfLoader = new GLTFLoader();

    // Setup default lighting
    this._setupLighting();

    // Add resize listener
    window.addEventListener('resize', this._boundResize);

    return this;
  }


  /**
   * Setup default scene lighting
   * @private
   */
  _setupLighting() {
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    // Hemisphere light for natural sky/ground lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    this.scene.add(hemiLight);

    // Directional light for shadows and highlights
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 5, 10);
    this.scene.add(dirLight);

    // Point light for additional depth
    const pointLight = new THREE.PointLight(0xffffff, 1.0, 100);
    pointLight.position.set(-5, -5, 5);
    this.scene.add(pointLight);
  }

  /**
   * Handle window resize events
   * @private
   */
  _handleResize() {
    if (!this.canvas || !this.camera || !this.renderer) return;

    const container = this.canvas.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);

    if (this.onResize) {
      this.onResize(width, height);
    }
  }

  /**
   * Main game loop with delta time calculations
   * @private
   */
  _gameLoop(currentTime) {
    if (!this.isRunning) return;

    this.animationFrameId = requestAnimationFrame(this._boundGameLoop);

    // Calculate delta time in seconds
    if (this.lastTime === 0) {
      this.lastTime = currentTime;
    }
    this.deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Cap delta time to prevent large jumps (e.g., when tab is inactive)
    this.deltaTime = Math.min(this.deltaTime, 0.1);

    // Update FPS counter
    this.frameCount++;
    if (currentTime - this.lastFpsUpdate >= this.fpsUpdateInterval) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFpsUpdate));
      this.frameCount = 0;
      this.lastFpsUpdate = currentTime;
    }

    // Skip update if paused, but still render
    if (!this.isPaused) {
      this.elapsedTime += this.deltaTime;
      this._update(this.deltaTime);
    }

    this._render();
  }

  /**
   * Update all registered systems
   * @private
   */
  _update(deltaTime) {
    // Update all registered systems
    for (const [name, system] of this.systems) {
      if (system.update && typeof system.update === 'function') {
        system.update(deltaTime);
      }
    }

    // Call custom update callback
    if (this.onUpdate) {
      this.onUpdate(deltaTime);
    }
  }

  /**
   * Render the scene
   * @private
   */
  _render() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }

    // Call custom render callback
    if (this.onRender) {
      this.onRender();
    }
  }


  /**
   * Start the game loop
   */
  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = 0;
    this.frameCount = 0;
    this.lastFpsUpdate = performance.now();

    this.animationFrameId = requestAnimationFrame(this._boundGameLoop);
  }

  /**
   * Stop the game loop
   */
  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Pause the game (stops updates but continues rendering)
   */
  pause() {
    this.isPaused = true;
  }

  /**
   * Resume the game from paused state
   */
  resume() {
    this.isPaused = false;
  }

  /**
   * Toggle pause state
   */
  togglePause() {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  }

  /**
   * Add a game system to the engine
   * @param {string} name - Unique name for the system
   * @param {object} system - System object with update method
   */
  addSystem(name, system) {
    if (this.systems.has(name)) {
      console.warn(`GameEngine: System "${name}" already exists, replacing...`);
    }
    this.systems.set(name, system);

    // Initialize system if it has an init method
    if (system.init && typeof system.init === 'function') {
      system.init(this);
    }
  }

  /**
   * Remove a game system from the engine
   * @param {string} name - Name of the system to remove
   */
  removeSystem(name) {
    const system = this.systems.get(name);
    if (system) {
      // Cleanup system if it has a dispose method
      if (system.dispose && typeof system.dispose === 'function') {
        system.dispose();
      }
      this.systems.delete(name);
    }
  }

  /**
   * Get a registered system by name
   * @param {string} name - Name of the system
   * @returns {object|undefined} The system or undefined
   */
  getSystem(name) {
    return this.systems.get(name);
  }

  /**
   * Load a GLTF model
   * @param {string} url - URL to the GLTF/GLB file
   * @returns {Promise<THREE.Group>} The loaded model
   */
  loadModel(url) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => resolve(gltf.scene),
        undefined,
        (error) => reject(error)
      );
    });
  }

  /**
   * Add an object to the scene
   * @param {THREE.Object3D} object - Object to add
   */
  addToScene(object) {
    if (this.scene && object) {
      this.scene.add(object);
    }
  }

  /**
   * Remove an object from the scene
   * @param {THREE.Object3D} object - Object to remove
   */
  removeFromScene(object) {
    if (this.scene && object) {
      this.scene.remove(object);
    }
  }

  /**
   * Get current performance metrics
   * @returns {object} Performance data
   */
  getPerformanceMetrics() {
    return {
      fps: this.fps,
      deltaTime: this.deltaTime,
      elapsedTime: this.elapsedTime,
      isRunning: this.isRunning,
      isPaused: this.isPaused
    };
  }

  /**
   * Cleanup and dispose of all resources
   */
  dispose() {
    // Stop the game loop
    this.stop();

    // Remove event listeners
    window.removeEventListener('resize', this._boundResize);

    // Dispose all systems
    for (const [name, system] of this.systems) {
      if (system.dispose && typeof system.dispose === 'function') {
        system.dispose();
      }
    }
    this.systems.clear();

    // Dispose Three.js resources
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }

    // Clear scene
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(mat => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      this.scene = null;
    }

    this.camera = null;
    this.canvas = null;
  }
}

export default GameEngine;
