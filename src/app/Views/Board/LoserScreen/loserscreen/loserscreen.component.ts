import {Component, inject, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {AuthService} from "@services/AuthService/auth.service";

@Component({
  selector: 'app-loserscreen',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './loserscreen.component.html',
  styleUrl: './loserscreen.component.css'
})
export class LoserscreenComponent {

  authService = inject(AuthService)

  @Input() winnerscreen: boolean = false;
  @Input() loserscreen: boolean = false;
  @Input() ships: number = 0;
  @Input() enemyShips: number = 0;

  constructor() { }

  ngOnInit()  {
  }

  goToMenu(){
    window.location.reload();
  }



}
