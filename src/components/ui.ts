import * as PIXI from 'pixi.js';
import { FanStacksManager } from '../managers/fanStackManager';
import { getAmountInDeck } from '../services/deck';

/**
 * Shows "Game Over" message and player's score on the screen.
 * Text sizes adapt to screen height with min/max limits.
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

export function showGameOver(app: PIXI.Application, fanStacksManager: FanStacksManager) {
  const totalCards = fanStacksManager.getTotalCardsCount();
  const amountInDeck = getAmountInDeck();

  // "Game Over" main text, centered on screen
  const gameOverText = new PIXI.Text('Game Over', {
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fill: 0xffffff,
    align: 'center',
  });
  gameOverText.anchor.set(0.5);
  app.stage.addChild(gameOverText);

  // Score text positioned at top-left corner
  const scoreText = new PIXI.Text(`Score: ${totalCards} / ${amountInDeck}`, {
    fontFamily: 'Arial',
    fill: 0xffffff,
  });
  app.stage.addChild(scoreText);

  // Update text sizes and positions on resize
  const updateTextLayout = () => {
    const gameOverFontSize = getAdaptiveFontSize(0.07, app.screen.height, 16, 64);
    const scoreFontSize = getAdaptiveFontSize(0.04, app.screen.height, 12, 32);

    gameOverText.style.fontSize = gameOverFontSize;
    gameOverText.position.set(app.screen.width / 2, app.screen.height / 2);

    scoreText.style.fontSize = scoreFontSize;
    scoreText.position.set(20, 20);
  };

  updateTextLayout();
  window.addEventListener('resize', updateTextLayout);
}
