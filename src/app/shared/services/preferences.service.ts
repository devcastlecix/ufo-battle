import { Injectable } from '@angular/core';
import { UserPreferences } from '../model/user-preference.model';
import { LocalStorageManagerService } from './local-storage-manager.service';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  constructor(
    private localStorageManager: LocalStorageManagerService
  ) { }

  savePreferences(userPreferences: UserPreferences): void {
    this.localStorageManager.setNumberUFOs(userPreferences.ufosNumber);
    this.localStorageManager.setTimeSeconds(userPreferences.timeSeconds);
  }

  getPreferences(): UserPreferences {
    return {
      ufosNumber: this.localStorageManager.getNumberUFOs(),
      timeSeconds: this.localStorageManager.getTimeSeconds()
    };
  }

  checkFields(userPreferences: UserPreferences): string[] {
    const validations: string[] = [];
    if (userPreferences.ufosNumber == null) {
      validations.push('Number of ufos is empty');
    }

    if (userPreferences.timeSeconds == null) {
      validations.push('Time of seconds is empty');
    }

    if (userPreferences.ufosNumber &&
       (userPreferences.ufosNumber>5 || userPreferences.ufosNumber<1)) {
      validations.push('The number of UFOs must be between 1 to 5'); 
    }

    if (userPreferences.timeSeconds && 
      ![60,120,180].includes(userPreferences.timeSeconds)) {
     validations.push('The time of seconds of UFOs must be 60, 120 or 180'); 
   }

    return validations;
  }  
}
