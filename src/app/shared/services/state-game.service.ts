import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UfoService } from './ufo.service';
import { PreferencesService } from './preferences.service';

@Injectable({
  providedIn: 'root'
})
export class StateGameService {
  private gameIsRunning = new BehaviorSubject<boolean>(false);
  private score = new BehaviorSubject<number>(0);
  private timeLeft = new BehaviorSubject<number>(60);
  private gameTimer?: any;

  constructor(
    private ufoService: UfoService,
    private preferencesService: PreferencesService
  ) {}

  startGame(duration: number): void {
    this.gameIsRunning.next(true);
    this.timeLeft.next(duration);
    this.score.next(0);
    this.gameTimer = setInterval(() => {
      const currentTime = this.timeLeft.value;
      if (currentTime <= 0) {
        this.stopGame();
      } else {
        this.timeLeft.next(currentTime - 1);
      }
    }, 1000);
  }

  stopGame(): void {
    this.gameIsRunning.next(false);
    this.ufoService.clearUFOs();
    clearInterval(this.gameTimer);
    this.calculateFinalScore();
  }

  calculateFinalScore(): void {
    const initialScore = this.score.value;
    const preferences = this.preferencesService.getPreferences();
    const selectedTime = preferences.timeSeconds;
    const numberOfUFOs = preferences.ufosNumber;

    const divisionFactor = selectedTime / 60;
    const reductionAmount = (numberOfUFOs - 1) * 50;
    const finalScore = Math.max(
      0,
      initialScore / divisionFactor - reductionAmount
    );
    this.score.next(finalScore);
  }

  getGameRunningStatus(): BehaviorSubject<boolean> {
    return this.gameIsRunning;
  }

  addScore(points: number): void {
    this.score.next(this.score.value + points);
  }

  subtractScore(points: number): void {
    const newScore = this.score.value - points;
    this.score.next(newScore >= 0 ? newScore : 0);
  }

  getScore(): BehaviorSubject<number> {
    return this.score;
  }

  getTimeLeft(): BehaviorSubject<number> {
    return this.timeLeft;
  }  
}
