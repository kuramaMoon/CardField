import * as PIXI from 'pixi.js';
import { FanStacksManager } from '../managers/fanStackManager';
import { getAmountInDeck } from '../services/deck';
import { ResizeManager } from '../managers/resizeManager ';

/**
 * Calculates font size based on screen height, constrained by min and max values.
 */
function getAdaptiveFontSize(
  basePercent: number,
  screenHeight: number,
  minSize: number,
  maxSize: number
): number {
  const size = Math.floor(screenHeight * basePercent);
  return Math.max(minSize, Math.min(size, maxSize));
}

/**
 * Displays "Game Over" and player's score, adapting text size and positioning on resize.
 */
export function showGameOver(app: PIXI.Application, fanStacksManager: FanStacksManager) {
  const totalCards = fanStacksManager.getTotalCardsCount();
  const amountInDeck = getAmountInDeck();

  // "Game Over" main message with styling
  const gameOverText = new PIXI.Text('Game Over', {
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fill: 0xFFFF99,
    stroke: 0x000000,
    strokeThickness: 3,
    align: 'center',
  });

  gameOverText.anchor.set(0.5);
  app.stage.addChild(gameOverText);

  // Score display text
  const scoreText = new PIXI.Text(`Score: ${totalCards} / ${amountInDeck}`, {
    fontFamily: 'Arial',
    fill: 0xffffff,
  });
  app.stage.addChild(scoreText);

  // Update font sizes and positions based on current screen size
  const updateTextLayout = () => {
    const gameOverFontSize = getAdaptiveFontSize(0.07, app.screen.height, 16, 64);
    const scoreFontSize = getAdaptiveFontSize(0.04, app.screen.height, 12, 32);

    gameOverText.style.fontSize = gameOverFontSize;
    gameOverText.position.set(app.screen.width / 2, app.screen.height / 2);

    scoreText.style.fontSize = scoreFontSize;
    scoreText.position.set(20, 20);
  };

  updateTextLayout();

  // Register layout update on window resize
  ResizeManager.onResize(updateTextLayout);
}
