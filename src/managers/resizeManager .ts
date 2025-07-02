import { Application, Container} from 'pixi.js';

type ResizeCallback = () => void;

export class ResizeManager {
  private static resizeTimeout: number | undefined; // Timeout ID for debouncing resize events
  private static resizeCallbacks: ResizeCallback[] = []; // List of callbacks to call after resize

  static init(app: Application, gameLayer: Container): void {
    const baseWidth = 1980;  // Base width for scaling
    const baseHeight = 1024; // Base height for scaling

    const applyResize = () => {
      const windowWidth = document.documentElement.clientWidth;  // Current window width
      const windowHeight = document.documentElement.clientHeight; // Current window height

      const scale = Math.min(windowWidth / baseWidth, windowHeight / baseHeight); // Scale to fit window
      app.renderer.resize(windowWidth, windowHeight); // Resize renderer to window size
      gameLayer.scale.set(scale); // Scale game layer

      const offsetX = (windowWidth - baseWidth * scale) / 2; // Center offset X
      const offsetY = (windowHeight - baseHeight * scale) / 2; // Center offset Y
      gameLayer.position.set(offsetX, offsetY); // Position game layer centered

      // Call all registered resize callbacks
      this.resizeCallbacks.forEach(cb => cb());
    };

    const resizeHandler = () => {
      if (this.resizeTimeout !== undefined) {
        clearTimeout(this.resizeTimeout); // Clear previous timeout if any
      }
      this.resizeTimeout = window.setTimeout(() => {
        applyResize(); // Apply resize after 300ms debounce
      }, 300);
    };

    window.addEventListener('resize', resizeHandler); // Listen to window resize

    applyResize(); // Initial resize call
  }

  // Register callback to be called after each resize
  static onResize(callback: ResizeCallback) {
    this.resizeCallbacks.push(callback);
  }
}
