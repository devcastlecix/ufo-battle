import { Component, Input } from '@angular/core';
import { UFO } from '../../../shared/model/ufo.model';

@Component({
  selector: 'app-ufo',
  standalone: false,
  
  templateUrl: './ufo.component.html',
  styleUrl: './ufo.component.css'
})
export class UfoComponent {
  @Input() ufo!: UFO;
}
