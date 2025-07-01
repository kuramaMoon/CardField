import * as PIXI from 'pixi.js';

/**
 * FlyingCard is a card sprite that rotates until caught.
 * Manages rotation, scaling, and interactivity.
 */
export class FlyingCard extends PIXI.Sprite {
  rotationSpeed: number;    // Rotation speed when flying
  isCaught: boolean = false; // True if the card is caught (stops rotation)

  /**
   * @param texture - PIXI texture for the card image
   * @param desiredHeight - optional height in pixels
   * @param rotationSpeed - optional rotation speed (default 0.05)
   */
  constructor(texture: PIXI.Texture, desiredHeight?: number, rotationSpeed: number = 0.05) {
    super(texture);

    this.rotationSpeed = rotationSpeed;

    this.anchor.set(0.5);           // Center pivot for rotation and scaling
    this.setInteractiveState(true); // Enable interaction and pointer cursor

    if (desiredHeight !== undefined) {
      this.setDesiredHeight(desiredHeight);
    }
  }

  /**
   * Rotates the card if it is not caught.
   * @param delta - frame time multiplier for smooth animation
   */
  update(delta: number) {
    if (!this.isCaught) {
      this.rotation += this.rotationSpeed * delta;
    }
  }

  /**
   * Adjusts card height based on screen height percentage.
   * Clamps between min and max size.
   * @param screenHeight - current screen height
   * @param percent - relative size of screen height (default 25%)
   * @param min - minimum height (default 60px)
   * @param max - maximum height (default 200px)
   */
  updateSizeByScreenHeight(screenHeight: number, percent: number = 0.25, min: number = 60, max: number = 200) {
    const desiredHeight = Math.max(min, Math.min(screenHeight * percent, max));
    this.setDesiredHeight(desiredHeight);
  }

  /**
   * Stops rotation and disables interaction.
   */
  catch() {
    this.isCaught = true;
    this.rotation = 0;
    this.setInteractiveState(false);
  }

  /**
   * Toggles interactivity and pointer cursor.
   * @param state - true to enable, false to disable
   */
  private setInteractiveState(state: boolean) {
    this.interactive = state;
    (this as any).buttonMode = state; // Used to avoid TypeScript errors
  }

  /**
   * Sets the card's height, maintaining aspect ratio.
   * @param desiredHeight - target height in pixels
   */
  setDesiredHeight(desiredHeight: number) {
    const scale = desiredHeight / this.texture.height;
    this.scale.set(scale);
  }

  /**
   * Resets the card for reuse: enables interaction and stops rotation.
   */
  reset() {
    this.isCaught = false;
    this.rotation = 0;
    this.setInteractiveState(true);
  }
}
