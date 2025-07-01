import { Application, Container, Graphics } from 'pixi.js';

export class ResizeManager {
  static init(app: Application, gameLayer: Container, maskLayer: Graphics): void {
    const baseWidth = 1980;
    const baseHeight = 1024;

    const resizeHandler = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Calculate scale to fit base resolution into the window while maintaining aspect ratio
      const scale = Math.min(windowWidth / baseWidth, windowHeight / baseHeight);

      // Resize the PIXI renderer to current window size
      app.renderer.resize(windowWidth, windowHeight);

      // Scale the game content accordingly
      gameLayer.scale.set(scale);

      // Center the game content by calculating offsets (letterboxing)
      const offsetX = (windowWidth - baseWidth * scale) / 2;
      const offsetY = (windowHeight - baseHeight * scale) / 2;
      gameLayer.position.set(offsetX, offsetY);

      // Clear previous mask graphics
      maskLayer.clear();
      maskLayer.beginFill(0x301d15);

      // Draw vertical letterbox bars if horizontal space exists
      if (offsetX > 0) {
        maskLayer.drawRect(0, 0, offsetX, windowHeight);
        maskLayer.drawRect(windowWidth - offsetX, 0, offsetX, windowHeight);
      }

      // Draw horizontal letterbox bars if vertical space exists
      if (offsetY > 0) {
        maskLayer.drawRect(0, 0, windowWidth, offsetY);
        maskLayer.drawRect(0, windowHeight - offsetY, windowWidth, offsetY);
      }

      maskLayer.endFill();
    };

    // Attach resize event listener and call once to set initial layout
    window.addEventListener('resize', resizeHandler);
    resizeHandler();
  }
}
