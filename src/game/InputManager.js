/**
 * InputManager - Handles keyboard and mouse input for the game
 * Requirements: 1.1, 1.2, 1.5, 7.1, 7.2
 */
export class InputManager {
  constructor() {
    this.keys = {};
    this.mouse = {
      x: 0,
      y: 0,
      lastX: 0,
      lastY: 0,
      deltaX: 0,
      deltaY: 0
    };
    
    // For double-tap detection
    this.lastKeyPressTime = {};
    this.doubleTapThreshold = 300; // ms
    this.doubleTapCallbacks = {};

    this._boundKeyDown = this._handleKeyDown.bind(this);
    this._boundKeyUp = this._handleKeyUp.bind(this);
    this._boundMouseMove = this._handleMouseMove.bind(this);
  }

  init() {
    window.addEventListener('keydown', this._boundKeyDown);
    window.addEventListener('keyup', this._boundKeyUp);
    window.addEventListener('mousemove', this._boundMouseMove);
  }

  dispose() {
    window.removeEventListener('keydown', this._boundKeyDown);
    window.removeEventListener('keyup', this._boundKeyUp);
    window.removeEventListener('mousemove', this._boundMouseMove);
  }

  _handleKeyDown(e) {
    const key = e.code;
    const now = performance.now();

    // Check for double tap
    if (this.lastKeyPressTime[key] && (now - this.lastKeyPressTime[key] < this.doubleTapThreshold)) {
      if (this.doubleTapCallbacks[key]) {
        this.doubleTapCallbacks[key]();
      }
    }

    this.keys[key] = true;
    this.lastKeyPressTime[key] = now;
  }

  _handleKeyUp(e) {
    this.keys[e.code] = false;
  }

  _handleMouseMove(e) {
    // Normalize mouse coordinates to -1 to 1
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    
    this.mouse.deltaX = e.clientX - this.mouse.lastX;
    this.mouse.deltaY = e.clientY - this.mouse.lastY;
    
    this.mouse.lastX = e.clientX;
    this.mouse.lastY = e.clientY;
  }

  isKeyDown(code) {
    return !!this.keys[code];
  }

  onDoubleTap(code, callback) {
    this.doubleTapCallbacks[code] = callback;
  }

  update() {
    // Reset deltas each frame
    this.mouse.deltaX = 0;
    this.mouse.deltaY = 0;
  }
}

export default InputManager;
