import * as PIXI from 'pixi.js';
import { FlyingCard } from './flyingCard';
import { FAN_CONFIG } from '../constants/fanConfig';

export class FanStack extends PIXI.Container {
  private cards: FlyingCard[] = []; // Cards in this fan
  private maxCards: number;          // Maximum cards allowed

  constructor(maxCards: number) {
    super();
    this.maxCards = maxCards;
  }

  /**
   * Adds a card to the fan, stops its rotation, disables interaction, and recalculates layout.
   */
  addCard(card: FlyingCard) {
    card.isCaught = true;
    card.rotation = 0;
    card.interactive = false;
    card.scale.set(card.scale.x);

    this.cards.push(card);
    this.addChild(card);
    this.recalculateFan();
  }

  /**
   * Returns current number of cards in the fan.
   */
  getCardsCount(): number {
    return this.cards.length;
  }

  /**
   * Returns the first card or null if empty.
   */
  getFirstCard(): FlyingCard | null {
    return this.cards.length > 0 ? this.cards[0] : null;
  }

  /**
   * Approximates fan width based on card width and overlap.
   */
  getWidth(): number {
    if (this.cards.length === 0) return 0;
    const cardWidth = this.cards[0].width * this.cards[0].scale.x;
    return (this.cards.length - 1) * (cardWidth * 0.4) + cardWidth;
  }

  /**
   * Arranges cards in a fan shape with calculated rotation and vertical offsets.
   */
  private recalculateFan() {
    const count = this.cards.length;
    if (count === 0) return;

    if (count === 1) {
      // Single card centered without rotation
      const card = this.cards[0];
      card.rotation = 0;
      card.position.set(0, -card.height / 2);
      card.zIndex = 0;
      return;
    }

    // Calculate angle between cards clamped by min and max
    const angleBetween = Math.min(
      FAN_CONFIG.MAX_ANGLE_BETWEEN,
      Math.max(FAN_CONFIG.MIN_ANGLE_BETWEEN, FAN_CONFIG.MAX_FAN_ANGLE / count)
    );

    const totalFan = angleBetween * (count - 1);
    const startAngle = -totalFan / 2;
    const middleIndex = (count - 1) / 2;
    const maxHeight = this.cards[0].height * 0.2;
    const smoothness = this.maxCards / 1.5;
    const curvatureStrength = Math.max(0.4, count / smoothness);

    // Set rotation and position of each card along a curved fan shape
    for (let i = 0; i < count; i++) {
      const card = this.cards[i];
      card.rotation = (startAngle + angleBetween * i) * (Math.PI / 180);
      const offsetX = i * (card.width * 0.15);

      const distance = Math.abs(i - middleIndex) / middleIndex;
      const offsetY = -maxHeight * curvatureStrength * (1 - distance ** 2) - card.height / 2;

      card.position.set(offsetX, offsetY);
      card.zIndex = i;
    }
  }
}
