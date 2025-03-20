import { Component,  OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ToastrService} from "ngx-toastr";
import { UserPreferences } from '../../shared/model/user-preference.model';
import { PreferencesService } from '../../shared/services/preferences.service';
import { DEFAULT_TIME_SECONDS, DEFAULT_UFO_COUNT } from '../../shared/constants/constants';

@Component({
  selector: 'app-preferences',
  standalone: false,
  
  templateUrl: './preferences.component.html',
  styles: []
})
export class PreferencesComponent implements OnInit{
  userPreferences: UserPreferences= {
    ufosNumber: DEFAULT_UFO_COUNT,
    timeSeconds: DEFAULT_TIME_SECONDS
  };

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private preferencesService: PreferencesService
  ) {}

  ngOnInit(): void {
    this.userPreferences = this.preferencesService.getPreferences();
  }

  onSubmit(event: any): void {
    event.preventDefault();
    const validations = this.preferencesService.checkFields(this.userPreferences);
    if (validations.length > 0) {
      validations.forEach(message => this.toastr.warning(message, 'Validation'));
      return;
    }
    this.preferencesService.savePreferences(this.userPreferences);
    this.router.navigate(['/game']);
  }
}
