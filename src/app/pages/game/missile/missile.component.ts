import { Component, Input } from '@angular/core';
import { Missile } from '../../../shared/model/missile.model';

@Component({
  selector: 'app-missile',
  standalone: false,
  
  templateUrl: './missile.component.html',
  styleUrl: './missile.component.css'
})
export class MissileComponent {
  @Input() missile!: Missile;
}
