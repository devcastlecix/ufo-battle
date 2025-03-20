import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenManagerService } from '../../shared/services/token-manager.service';

@Component({
  selector: 'app-records',
  standalone: false,
  
  templateUrl: './records.component.html',
  styleUrl: './records.component.css'
})
export class RecordsComponent implements OnInit{
  isLoggedIn$!: Observable<boolean>;

  constructor(private tokenService: TokenManagerService) {}
  ngOnInit(): void {
    this.isLoggedIn$ = this.tokenService.isLoggedIn;
  }

}
