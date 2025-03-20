import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { StateGameService } from '../../../shared/services/state-game.service';
import { TokenManagerService } from '../../../shared/services/token-manager.service';
import { PreferencesService } from '../../../shared/services/preferences.service';
import { Record } from '../../../shared/model/record.model';
import { RecordsService } from '../../../shared/services/records.service';
import { ToastrService } from 'ngx-toastr';
import { RecordScore } from '../../../shared/model/record-score';
import Swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-panel',
  standalone: false,
  
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent implements OnInit, OnDestroy {
  isLoggedIn$!: Observable<boolean>;
  score: number = 0;
  timeLeft: number = 0;
  gameIsRunning: boolean = false;
  private scoreSubscription?: Subscription;
  private timeSubscription?: Subscription;
  private gameRunningSubscription?: Subscription;  
  isButtonDisabled: boolean = false;

  constructor(
    private gameStateService: StateGameService,
    private tokenService: TokenManagerService,
    private recordsService: RecordsService,
    private preferencesService: PreferencesService,
    private toastr: ToastrService
  ) {
  }


  startNewGame(): void {
    window.location.reload();
  }

  onSaveRecords(): void {
    Swal.fire({
      title: 'Score',
      html: `Do you want to save your score?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((save) => {
      if (save.value) {
        this.saveRecord();
      }
    });   
  }

  saveRecord():void {
    const preferences = this.preferencesService.getPreferences();
    const token = this.tokenService.getJwtToken() ?? '';
    const recordScore: RecordScore = {
      punctuation: this.score,
      ufos: preferences.ufosNumber,
      disposedTime: preferences.timeSeconds      
    };

    this.recordsService.saveRecords(recordScore, token).subscribe({
      next: (response) => {
        this.isButtonDisabled = true;
        this.toastr.success(`Score successfully saved. `, 'Score', {
          positionClass: 'toast-bottom-full-width'
        });
      },
      error: (error: HttpResponse<any>) => this.handleSaveError(error)
    });    
  }

  handleSaveError(error: HttpResponse<any>): void {        
    if (error.status === 400) {
      this.toastr.error('missing parameter', 'Score failed');
      return;
    }
    if (error.status === 401) {
      this.toastr.error('	no valid token', 'Score failed');
      return;
    }
    this.toastr.error('An error occurred while saving score.','Error');
    console.error(error);
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.tokenService.isLoggedIn;
    this.gameRunningSubscription = this.gameStateService
      .getGameRunningStatus()
      .subscribe((isRunning) => {
        this.gameIsRunning = isRunning;
      });

    this.scoreSubscription = this.gameStateService
      .getScore()
      .subscribe((score) => {
        this.score = score;
      });

    this.timeSubscription = this.gameStateService
      .getTimeLeft()
      .subscribe((time) => {
        this.timeLeft = time;
      });
  }

  ngOnDestroy(): void {
    this.scoreSubscription?.unsubscribe();
    this.timeSubscription?.unsubscribe();
    this.gameRunningSubscription?.unsubscribe();
  }
}
