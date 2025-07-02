// import { Application, Container, Graphics } from 'pixi.js';

// export class ResizeManager {
//   private static resizeTimeout: number | undefined;
//   private static lastWidth: number = 0;
//   private static lastHeight: number = 0;

//   static init(app: Application, gameLayer: Container, maskLayer: Graphics): void {
//     const baseWidth = 1980;
//     const baseHeight = 1024;

//     const doResize = () => {
//       const windowWidth = window.innerWidth;
//       const windowHeight = window.innerHeight;

//       // Если размеры не изменились — не пересчитываем
//       if (windowWidth === this.lastWidth && windowHeight === this.lastHeight) {
//         return;
//       }

//       this.lastWidth = windowWidth;
//       this.lastHeight = windowHeight;

//       const scale = Math.min(windowWidth / baseWidth, windowHeight / baseHeight);

//       app.renderer.resize(windowWidth, windowHeight);

//       gameLayer.scale.set(scale);

//       const offsetX = (windowWidth - baseWidth * scale) / 2;
//       const offsetY = (windowHeight - baseHeight * scale) / 2;
//       gameLayer.position.set(offsetX, offsetY);

//       // Обновляем маску (letterbox)
//       maskLayer.clear();
//       maskLayer.beginFill(0x301d15);

//       if (offsetX > 0) {
//         maskLayer.drawRect(0, 0, offsetX, windowHeight);
//         maskLayer.drawRect(windowWidth - offsetX, 0, offsetX, windowHeight);
//       }

//       if (offsetY > 0) {
//         maskLayer.drawRect(0, 0, windowWidth, offsetY);
//         maskLayer.drawRect(0, windowHeight - offsetY, windowWidth, offsetY);
//       }

//       maskLayer.endFill();
//     };

//     const resizeHandler = () => {
//       if (this.resizeTimeout !== undefined) {
//         clearTimeout(this.resizeTimeout);
//       }
//       // Ждём, пока размер окна стабилизируется
//       this.resizeTimeout = window.setTimeout(() => {
//         doResize();
//       }, 200);
//     };

//     // Слушаем resize + orientationchange
//     window.addEventListener('resize', resizeHandler);
//     window.addEventListener('orientationchange', resizeHandler);

//     // Для некоторых браузеров: слушаем visualViewport, если есть
//     if (window.visualViewport) {
//       window.visualViewport.addEventListener('resize', resizeHandler);
//     }

//     // Первичная инициализация
//     doResize();
//   }
// }

// import { Application, Container, Graphics } from 'pixi.js';

// export class ResizeManager {
//   private static resizeTimeout: number | undefined;

//   static init(app: Application, gameLayer: Container, maskLayer: Graphics): void {
//     const baseWidth = 1980;
//     const baseHeight = 1024;

//     const applyResize = () => {
//       const windowWidth = window.innerWidth;
//       const windowHeight = window.innerHeight;

//       console.log(`✅ FINAL windowWidth, windowHeight: ${windowWidth}, ${windowHeight}`);

//       const scale = Math.min(windowWidth / baseWidth, windowHeight / baseHeight);
//       app.renderer.resize(windowWidth, windowHeight);
//       gameLayer.scale.set(scale);

//       const offsetX = (windowWidth - baseWidth * scale) / 2;
//       const offsetY = (windowHeight - baseHeight * scale) / 2;
//       gameLayer.position.set(offsetX, offsetY);

//       // maskLayer.clear();
//       // maskLayer.beginFill(0x663300);

//       // if (offsetX > 0) {
//       //   maskLayer.drawRect(0, 0, offsetX, windowHeight);
//       //   maskLayer.drawRect(windowWidth - offsetX, 0, offsetX, windowHeight);
//       // }

//       // if (offsetY > 0) {
//       //   maskLayer.drawRect(0, 0, windowWidth, offsetY);
//       //   maskLayer.drawRect(0, windowHeight - offsetY, windowWidth, offsetY);
//       // }

//       // maskLayer.endFill();
//     };

//     const resizeHandler = () => {
//       if (this.resizeTimeout !== undefined) {
//         clearTimeout(this.resizeTimeout);
//       }
//       // Ждём 200 мс, чтобы размеры стабилизировались
//       this.resizeTimeout = window.setTimeout(() => {
//         applyResize();
//       }, 100);
//     };

//       window.addEventListener('resize', resizeHandler);
//       window.addEventListener('orientationchange', resizeHandler);

//     // Первичная отрисовка
//       applyResize();
//   }
// }

import { Application, Container} from 'pixi.js';

export class ResizeManager {
  private static resizeTimeout: number | undefined;

  static init(app: Application, gameLayer: Container): void {
    const baseWidth = 1980;
    const baseHeight = 1024;

    const applyResize = () => {
      const windowWidth = document.documentElement.clientWidth;
      const windowHeight = document.documentElement.clientHeight;
      console.log(`✅ FINAL windowWidth, windowHeight: ${windowWidth}, ${windowHeight}`);

      const scale = Math.min(windowWidth / baseWidth, windowHeight / baseHeight);
      app.renderer.resize(windowWidth, windowHeight);
      gameLayer.scale.set(scale);

      const offsetX = (windowWidth - baseWidth * scale) / 2;
      const offsetY = (windowHeight - baseHeight * scale) / 2;
      gameLayer.position.set(offsetX, offsetY);

      //  maskLayer.clear();
      //  maskLayer.beginFill(0x663300);
      //  maskLayer.endFill();
    };

    const resizeHandler = () => {
      if (this.resizeTimeout !== undefined) {
        clearTimeout(this.resizeTimeout);
      }

      this.resizeTimeout = window.setTimeout(() => {
        applyResize();
      }, 300); // 200–300 мс достаточно
    };

    window.addEventListener('resize', resizeHandler);
    // orientationchange можно не слушать — resize его перекрывает

    applyResize(); // начальная отрисовка
  }
}
