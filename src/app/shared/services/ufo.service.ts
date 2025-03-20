import { Injectable } from '@angular/core';
import { UFO } from '../model/ufo.model';
import { Missile } from '../model/missile.model';

@Injectable({
  providedIn: 'root'
})
export class UfoService {
  ufos: UFO[] = [];

  constructor() {}

  createUFOs(
    quantity: number,
    gameArea: { width: number; height: number }
  ): void {
    for (let i = 0; i < quantity; i++) {
      const newLeft = Math.random() * gameArea.width;
      const newBottom = Math.random() * (gameArea.height - 100) + 80; // 100 and 50 are arbitrary numbers for offset

      const ufo: UFO = {
        position: {
          x: newLeft,
          y: newBottom,
        },
        imageUrl: 'assets/imgs/ufo.png',
        class: 'setOfUfos',
        horStep:  Math.random() > 0.5 ? 5 : -5,
        isExploded: false,
        width: 60,
        height: 60
      };

      this.ufos.push(ufo);
    }
  }

  moveUFOs(): void {
    const rightLimit = window.innerWidth;

    this.ufos.forEach((ufo) => {
      ufo.position.x += ufo.horStep;
      const widthUfo = 60;
      if (ufo.position.x + widthUfo > rightLimit || ufo.position.x < 0) {
        ufo.horStep = -ufo.horStep;
      }
    });
  }

  getUfoRect(ufo: UFO): {
    left: number;
    right: number;
    top: number;
    bottom: number;
  } {
    return {
      left: ufo.position.x,
      right: ufo.position.x + ufo.width,
      top: ufo.position.y,
      bottom: ufo.position.y + ufo.height,
    };
  }

  hitCheck(missile: Missile): UFO | null {
    for (const ufo of this.ufos) {
      const ufoRect = this.getUfoRect(ufo);
      if (
        missile.position.x < ufoRect.right &&
        missile.position.x + missile.width > ufoRect.left &&
        missile.position.y < ufoRect.bottom &&
        missile.position.y + missile.height > ufoRect.top &&
        !ufo.isExploded
      ) {
        this.explodeUfo(ufo);

        return ufo;
      }
    }
    return null;
  }

  explodeUfo(ufo: UFO): void {
    ufo.imageUrl = 'assets/imgs/explosion.gif';
    setTimeout(() => {
      ufo.imageUrl = 'assets/imgs/ufo.png';
      ufo.isExploded = false;      
    }, 1000);
  }

  clearUFOs(): void {
    this.ufos = [];
  }
}
