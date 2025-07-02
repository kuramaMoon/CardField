import * as PIXI from 'pixi.js';
import { FanStacksManager } from './managers/fanStackManager';
import { startGame } from './scenes/game';
import { ResizeManager } from './managers/resizeManager ';

const app = new PIXI.Application({
  backgroundColor: 0x005500, 
      width: 1980,
      height: 1024,
      antialias: true,
});

document.body.appendChild(app.view as HTMLCanvasElement);

// Create main game container
const gameLayer = new PIXI.Container();
app.stage.addChild(gameLayer);

// Initialize fan stacks manager and add to game layer
const fanStacksManager = new FanStacksManager(app.screen.width, app.screen.height);
gameLayer.addChild(fanStacksManager);

// Setup resize handling for responsive scaling and letterboxing
ResizeManager.init(app, gameLayer);

// Start the game logic
startGame(app, fanStacksManager, gameLayer);
