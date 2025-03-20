import { Injectable } from '@angular/core';
import { UfoService } from './ufo.service';
import { StateGameService } from './state-game.service';
import { Missile } from '../model/missile.model';

@Injectable({
  providedIn: 'root'
})
export class MissileService {
  missile: Missile = {
    position: { x: 700, y: 0 },
    velocity: 5,
    isLaunched: false,
    imageUrl: 'assets/imgs/misil.png',
    width: 40,
    height: 70,
  };
  private launchIntervalId: any;

  constructor(
    private ufoService: UfoService,
    private stateGameService: StateGameService
  ) {}

  moveRight(): void {
    if(this.missile.isLaunched) return;
    const rightLimit = window.innerWidth - 40;
    if (this.missile.position.x < rightLimit) {
      this.missile.position.x += this.missile.velocity;
    }
  }

  moveLeft(): void {
    if(this.missile.isLaunched) return;

    if (this.missile.position.x > 0) {
      this.missile.position.x -= this.missile.velocity;
    }
  }

  launch(): void {
    if (!this.missile.isLaunched) {
      this.missile.isLaunched = true;
      this.launchIntervalId = setInterval(() => {
        this.missile.position.y += this.missile.velocity;

        const hitUfo = this.ufoService.hitCheck(this.missile);
        if (hitUfo) {
          this.stateGameService.addScore(100);
          this.resetMissile();
        }

        if (this.missile.position.y > window.innerHeight) {
          this.resetMissile();
          this.stateGameService.subtractScore(25);
        }
      }, 10);
    }
  }
  resetMissile(): void {
    clearInterval(this.launchIntervalId);
    this.missile.isLaunched = false;
    this.missile.position.y = 0;
  }

  getMessile(): any {
    return this.missile;
  }
}
