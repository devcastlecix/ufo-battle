import { Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import { UFO } from '../../shared/model/ufo.model';
import { Missile } from '../../shared/model/missile.model';
import { PreferencesService } from '../../shared/services/preferences.service';
import { UfoService } from '../../shared/services/ufo.service';
import { StateGameService } from '../../shared/services/state-game.service';
import { Subscription } from 'rxjs';
import { MissileService } from '../../shared/services/missile.service';


@Component({
  selector: 'app-game',
  standalone: false,
  
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit, OnDestroy  {
  ufos: UFO[] ;
  missile: Missile;
  gameIsRunning: boolean = false;
  private moveUfosInterval: any;
  private gameRunningSubscription?: Subscription;

  constructor(    
    private preferencesService: PreferencesService,
    private ufoService: UfoService,
    private gameStateService: StateGameService,
    private missileService: MissileService
  ) {
    this.ufos = this.ufoService.ufos;
    this.missile  = this.missileService.missile
  }


  ngOnInit(): void {
    this.gameRunningSubscription = this.gameStateService
      .getGameRunningStatus()
      .subscribe((isRunning) => {
        this.gameIsRunning = isRunning;
      });
    
    const preferences = this.preferencesService.getPreferences();
    this.gameStateService.startGame(preferences.timeSeconds);

    const gameArea = {
      width: 800,
      height: 600,
    };
    this.ufoService.createUFOs(preferences.ufosNumber, gameArea);
    this.moveUfosInterval = setInterval(() => this.ufoService.moveUFOs(), 25);    
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.gameIsRunning) {
      if (event.key === 'ArrowRight') {
        this.missileService.moveRight();
      } else if (event.key === 'ArrowLeft') {
        this.missileService.moveLeft();
      } else if (event.key === ' ' && !this.missile.isLaunched) {
        this.missileService.launch();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.moveUfosInterval) {
      clearInterval(this.moveUfosInterval);
    }

    this.gameStateService.stopGame();        
  }


}
