import { Component, OnInit } from '@angular/core';
import { Record } from '../../../shared/model/record.model';
import { RecordsService } from '../../../shared/services/records.service';
import { TokenManagerService } from '../../../shared/services/token-manager.service';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-scores',
  standalone: false,
  
  templateUrl: './user-scores.component.html',
  styles: []
})
export class UserScoresComponent implements OnInit {
   scoresUser : Array<Record> = [];
   loading:boolean = false;

   constructor(private toastr: ToastrService,
               private recordsService: RecordsService,
               private tokenService: TokenManagerService) {      
  }

  ngOnInit(): void {
    this.loadScoresUser();
  }

  loadScoresUser(): void {
    this.loading = true;
    const token = this.tokenService.getJwtToken() ?? '';
    const username = this.tokenService.getUsername();
    this.recordsService.getRecordsByUsername(username, token).subscribe({
      next: (response: HttpResponse<any>) => this.handleLoadSuccess(response),
      error: (error: HttpResponse<any>) => this.handleLoadError(error)
    });
    
  }
    
  handleLoadSuccess(response: HttpResponse<any>): void {
    this.loading=false;
    if (response.status !== 200) {
      this.toastr.info('Load records: Worked but errors', 'Loaded failed');
      return;
    }    
    this.scoresUser = response.body as Array<Record>;      
  }
     
  handleLoadError(response: HttpResponse<any>): void {
    this.loading=false;
    this.toastr.error('Loaded failed. Please try again.', 'Error');
  }
}
