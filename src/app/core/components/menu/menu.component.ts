import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenManagerService } from '../../../shared/services/token-manager.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu',
  standalone: false,
  
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;

  constructor(private tokenService: TokenManagerService) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.tokenService.isLoggedIn;
  }

  logout(): void {
    const username = this.tokenService.getUsername();
    Swal.fire({
      title: 'Logout',
      html: `Hey <b>${username}</b>! You are going to close the session.`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'SI'
    }).then((borrar) => {
      if (borrar.value) {
        this.tokenService.clearToken();
      }
    });    
  }
}
