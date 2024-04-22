import { Component, HostListener } from '@angular/core';
import { TableroComponent } from '@components/game/tablero/tablero.component';

import { delay } from 'rxjs';
import { NotificationService } from '@services/WS/notification.service';
import { TableroRivalComponent } from '@components/game/tablero-rival/tablero-rival.component';
import { Router } from '@angular/router';
import { GameInstanceService } from '@services/GameInstance/game-instance.service';
import { AuthService } from '@services/AuthService/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-juego',
  standalone: true,
  imports: [
        TableroComponent,
        TableroRivalComponent
    ],
  templateUrl: './juego.component.html',
  styleUrl: './juego.component.css'
})
export class JuegoComponent {
    constructor(
        private readonly notificationService: NotificationService,
        private router: Router,
        private gameService: GameInstanceService,
        private auth: AuthService,
        private toast: ToastrService
    ) { }

/*
    @HostListener('window:beforeunload', ['$event'])
    public beforeunloadHandler(event: Event) {
        event.returnValue = true;
        if(event.returnValue){
            this.gameService.endGame(localStorage.getItem('gameId') || '').subscribe(data => {console.log(data)}, err => {console.log(err)})
            this.leaveGame();
        }
    }
*/
    ngOnInit(){
        this.inicializarTablero();
        this.listenToNotify();
        this.listenToWinner()
    }

    listenToNotify(){
        this.notificationService.lsitenToEvent((eventData) => {
      });
    }

    listenToWinner(){
        this.notificationService.WinnerAlert((eventData) => {
          console.log("Ganador", eventData);
        } );
}

    tablero: number[][] = []
    tablero_rival: number[][] = []
    ganador: boolean = false

    disparos: number[][] = []
    barcos: number[][] = []

    inicializarTablero() {
        this.tablero = Array.from({ length: 8 }, () => Array(15).fill(0));
        this.tablero_rival = Array.from({ length: 8 }, () => Array(15).fill(0));
    }
    leaveConfirm(){
        if(confirm("¿Estás seguro que deseas abandonar la partida?")){
            this.gameService.endGame(this.auth.getUserId().toString(), localStorage.getItem('gameId') || '').subscribe(data => {console.log(data)}, err => {console.log(err)})
            this.leaveGame()
        }
    }
    checkBoats(tablero: number[][]) {
         console.log("donde me dispararon",tablero);
        this.disparos = tablero;
    }

    mostrarTablero(tablero: number[][]){
        console.log("mi tablero", tablero)
        this.barcos = tablero;
        console.log("Matices combinadas" ,this.actualizarMatrices(this.barcos, this.disparos))
        this.tablero = this.actualizarMatrices(this.barcos, this.disparos)
        this.ganador = this.checkBoatsAlive(this.tablero);
        if (this.ganador !== false){
            this.sendLosser(this.auth.getUserId().toString())
          //this.toast.success('Ostrar', 'Ganaste')
          //this.router.navigate(['/start']);
        }
    }

    sendLosser(user_id: string){
        this.gameService.endGame(user_id, localStorage.getItem('gameId') || '').subscribe(
            data => {
                console.log(data)
        })
    }

actualizarMatrices(matriz1: number[][], matriz2: number[][]): number[][] {
  for (let i = 0; i < matriz1.length; i++) {
    for (let j = 0; j < matriz1[0].length; j++) {
      if (matriz1[i][j] === 0 && matriz2[i][j] === 2) {
        matriz1[i][j] = 2;
      } else if (matriz1[i][j] === 1 && matriz2[i][j] === 2) {
        matriz1[i][j] = 3;
        this.sendNotify();
      }
    }
  }
  return matriz1;
}

checkBoatsAlive(tablero: number[][]): boolean {
  for (let i = 0; i < tablero.length; i++) {
    for (let j = 0; j < tablero[i].length; j++) {
      if (tablero[i][j] === 1) {
        return true;
      }
    }
  }
  return false;
}


sendNotify(){
    this.gameService.sendAlert().subscribe(data => {})
}


    leaveGame(){
        localStorage.removeItem('gameId');
        localStorage.removeItem('player1');
        localStorage.removeItem('player2');
        localStorage.removeItem('tablero');
        localStorage.removeItem('turn');
        this.router.navigate(['/menu']);
    }



}
