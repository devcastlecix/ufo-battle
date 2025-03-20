import { Component, Input } from '@angular/core';
import { Record } from '../../model/record.model';

@Component({
  selector: 'app-records-table',
  standalone: false,
  
  templateUrl: './records-table.component.html',
  styles: []
})
export class RecordsTableComponent {
  @Input() records: Record[] = [];
}
