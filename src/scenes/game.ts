import * as PIXI from 'pixi.js';
import { drawCard } from '../services/deck';
import type { CardInfo } from '../services/deck';
import { FlyingCard } from '../components/flyingCard';
import { FanStacksManager } from '../managers/fanStackManager';
import { showGameOver } from '../components/ui';

let currentCard: FlyingCard | null = null;
let flightDuration = 3000;
let animationFrameId: number | null = null;

const cardsQueue: CardInfo[] = []; // Queue of preloaded cards

/**
 * Starts the game: preload cards, run card loop, add rotation update.
 */
export async function startGame(
  app: PIXI.Application,
  fanStacksManager: FanStacksManager,
  gameLayer: PIXI.Container
) {
  await preloadCards();
  await playNextCard(app, fanStacksManager, gameLayer);

  // Update card rotation each frame while card is active and not caught
  app.ticker.add((delta) => {
    if (currentCard && !currentCard.isCaught) {
      currentCard.update(delta);
    }
  });
}

/**
 * Preloads cards until queue has at least 5 cards.
 */
async function preloadCards() {
  while (cardsQueue.length < 5) {
    const cardData = await drawCard();
    if (!cardData) break; // No more cards available
    cardsQueue.push(cardData);
  }
}

/**
 * Plays next card from queue, animates its flight and handles catch or end of animation.
 */
async function playNextCard(
  app: PIXI.Application,
  fanStacksManager: FanStacksManager,
  gameLayer: PIXI.Container
): Promise<void> {
  if (cardsQueue.length === 0) {
    await preloadCards();
  }

  // End game if no cards left to play
  if (cardsQueue.length === 0) {
    showGameOver(app, fanStacksManager);
    return;
  }

  const cardData = cardsQueue.shift()!;
  const texture = await PIXI.Texture.fromURL(cardData.image);
  const heightScene = 1024;
  const widthScene = 1980;
  const desiredHeight = heightScene / 4;
  const card = new FlyingCard(texture, desiredHeight);
  currentCard = card;

  // Randomize start and end Y positions for flight
  const startY = Math.random() * heightScene * 0.8;
  const endY = Math.random() * heightScene * 0.8;
  const startX = widthScene + 100; // Start offscreen right
  const endX = -250;               // End offscreen left

  card.x = startX;
  card.y = startY;
  card.rotationSpeed = (Math.random() - 0.5) * 0.2;

  card.interactive = true;
  (card as any).buttonMode = true;

  return new Promise<void>((resolve) => {
    // Handle card catch by player click
    card.on('pointerdown', async () => {
      if (card.isCaught) return;

      card.catch();
      fanStacksManager.addCard(card);
      flightDuration = Math.max(1000, flightDuration - 50);

      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      gameLayer.removeChild(card);
      await preloadCards();

      resolve();
      playNextCard(app, fanStacksManager, gameLayer);
    });

    gameLayer.addChild(card);

    // Animate card flight and proceed if card not caught
    animateCard(card, startX, startY, endX, endY).then(async () => {
      if (!card.isCaught) {
        gameLayer.removeChild(card);
        await preloadCards();

        resolve();
        playNextCard(app, fanStacksManager, gameLayer);
      }
    });
  });
}

/**
 * Animates card flying across screen with ease-out quadratic timing.
 */
function animateCard(
  card: FlyingCard,
  startX: number,
  startY: number,
  endX: number,
  endY: number
): Promise<void> {
  const startTime = Date.now();

  return new Promise((resolve) => {
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / flightDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 2); // Ease-out quadratic

      card.x = startX + (endX - startX) * eased;
      card.y = startY + (endY - startY) * eased;

      if (progress < 1 && !card.isCaught) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };
    animate();
  });
}
