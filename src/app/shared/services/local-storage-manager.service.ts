import { Injectable } from '@angular/core';
import { DEFAULT_TIME_SECONDS, DEFAULT_UFO_COUNT, KEY_NUMBER_UFOS, KEY_TIME_SECONDS } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageManagerService {
  
  constructor() { }

  getNumberUFOs(): number {
    const numberUfos = localStorage.getItem(KEY_NUMBER_UFOS) ?? DEFAULT_UFO_COUNT;    
    const parsedNumberUfos = Number(numberUfos);    
    return isNaN(parsedNumberUfos) ? DEFAULT_UFO_COUNT : parsedNumberUfos;
  }

  getTimeSeconds(): number {
    const timeSeconds = localStorage.getItem(KEY_TIME_SECONDS) ?? DEFAULT_TIME_SECONDS;
    const parsedTimeSeconds = Number(timeSeconds);
    return isNaN(parsedTimeSeconds) ? DEFAULT_TIME_SECONDS : parsedTimeSeconds;
  }


  setTimeSeconds(timeSeconds: number): void {
    localStorage.setItem(KEY_TIME_SECONDS, (timeSeconds ?? DEFAULT_TIME_SECONDS).toString());
  }

  setNumberUFOs(numberUFOs: number): void {
    localStorage.setItem(KEY_NUMBER_UFOS, (numberUFOs ?? DEFAULT_UFO_COUNT).toString());
  }  

}
