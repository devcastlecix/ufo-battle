import { Component, OnInit } from '@angular/core';
import { Record } from '../../../shared/model/record.model';
import { RecordsService } from '../../../shared/services/records.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-general-scores',
  standalone: false,
  
  templateUrl: './general-scores.component.html',
  styles: []
})
export class GeneralScoresComponent implements OnInit {
    scoresGeneral: Array<Record> = [];
    loading:boolean = false;

    constructor(private toastr: ToastrService,
      private recordsService: RecordsService) {      
    }

    loadScoresGeneral(): void {
      this.loading = true;
      this.recordsService.getRecordsGeneral().subscribe({
        next: (records: Array<Record>) => {          
          this.loading = false;
          this.scoresGeneral = records;          
        },
        error: (error) => {
          this.loading = false;
          console.log(error);
          this.toastr.error('Loaded failed. Please try again.', 'Error');
        }
      });
    }

    ngOnInit(): void {
      this.loadScoresGeneral();
    }
}
