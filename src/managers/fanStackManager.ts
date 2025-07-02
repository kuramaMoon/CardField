import * as PIXI from 'pixi.js';
import { FanStack } from '../components/fanStack';
import { FlyingCard } from '../components/flyingCard';
import { FAN_CONFIG } from '../constants/fanConfig';

export class FanStacksManager extends PIXI.Container {
  private fanStacks: FanStack[] = [];
  private maxFanCardsCount: number;
  private screenWidth: number;
  private screenHeight: number;

  constructor(screenWidth: number, screenHeight: number) {
    super();
    // Calculate max cards per fan based on angle limits
    this.maxFanCardsCount = Math.floor(FAN_CONFIG.MAX_FAN_ANGLE / FAN_CONFIG.MIN_ANGLE_BETWEEN) + 1;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    console.log(`screenHeight: ${screenHeight}`)
    // Position container near bottom of screen
    this.position.set(0, this.screenHeight * 0.99);
  }

  /**
   * Adds a card to the last fan stack or creates a new one if full.
   * Repositions fans when a fan reaches max capacity.
   */
  addCard(card: FlyingCard) {
    let lastFan = this.fanStacks[this.fanStacks.length - 1];

    if (!lastFan || lastFan.getCardsCount() >= this.maxFanCardsCount) {
      lastFan = new FanStack(this.maxFanCardsCount);
      this.fanStacks.push(lastFan);
      this.addChild(lastFan);

      const centerX = this.screenWidth / 2;
      lastFan.position.set(centerX, 0);
    }

    lastFan.addCard(card);

    if (lastFan.getCardsCount() >= this.maxFanCardsCount) {
      this.positionFans();
    }
  }

  /**
   * Positions each fan stack with calculated horizontal and vertical offsets,
   * creating a slight staggered effect.
   */
  private positionFans() {
    if (this.fanStacks.length === 0) return;

    const firstCard = this.fanStacks[0].getFirstCard();
    if (!firstCard) return;

    const cardHeight = firstCard.height;
    const startPosition = cardHeight / 2 + FAN_CONFIG.MAX_ANGLE_BETWEEN;
    const ySpace = (cardHeight / 3.5) * (this.fanStacks.length - 1);

    for (let i = 0; i < this.fanStacks.length; i++) {
      const xOffset = (cardHeight / 6.5) * i;
      const yOffset = (cardHeight / 3.5) * i;
      this.fanStacks[i].position.set(startPosition + xOffset, yOffset - ySpace);
    }
  }

  /**
   * Updates fan stacks' positions (useful on screen resize).
   */
  updatePosition() {
    this.positionFans();
  }

  /**
   * Returns total number of cards across all fans.
   */
  getTotalCardsCount(): number {
    return this.fanStacks.reduce((sum, fan) => sum + fan.getCardsCount(), 0);
  }

  /**
   * Updates screen size and repositions fans accordingly.
   */
  setScreenSize(width: number, height: number) {
    this.screenWidth = width;
    this.screenHeight = height;
    this.position.set(0, this.screenHeight * 0.99);
    this.updatePosition();
  }
}
