import {Component, HostListener, inject} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {AuthService} from "@services/AuthService/auth.service";
import {EchoService} from "@services/EchoService/echo.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {LoaderTypeOneComponent} from "@components/Loaders/loader-type-one/loader-type-one.component";
import {LoserscreenComponent} from "../LoserScreen/loserscreen/loserscreen.component";

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    LoaderTypeOneComponent,
    NgIf,
    LoserscreenComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {

  //w = water
  //s = ship
  //h = hit
  //m = miss

  authService = inject(AuthService)
  echoService = inject(EchoService)
  toastr = inject(ToastrService)
  router = inject(Router)

  gameFinished = false;
  shooting = false;
  looserScreen = false;
  winnerScreen = false;

  board: string[][] = Array.from({length: 8}, () => Array(5).fill('w'));
  enemyBoard: string[][] = Array.from({length: 8}, () => Array(5).fill('w'));

  playerTurn = localStorage.getItem('turn');
  gameId = localStorage.getItem('gameId');
  myId = this.authService.getUserId();
  enemyId = this.defineEnemyId();
  boats = 15;
  enemyBoats = this.boats;



  ngOnInit(){
    this.placeRandomShips(this.board, this.boats);
    setTimeout(() => {
      this.echoService.attackEvent((data) => {

        if(data.data[2] == this.authService.getUserId()){
          if(this.board[data.data[1][0]][data.data[1][1]] == 's'){
            //this.playerTurn = data.data[3]
            this.playerTurn = data.data[2] //En caso de que el profe quiera que el turno se pase al sig jugador aun así acertaces el tiro
            this.board[data.data[1][0]][data.data[1][1]] = 'h';
            this.toastr.warning('Ouch! Te han dado!', 'Ataque enemigo')
            this.boats--;
            this.echoService.attackSuccessEndpoint(true, data.data[3], data.data[1], data.data[3]).subscribe(data => {
            });
            if(this.boats == 0) {
              this.gameFinished = true;
              this.echoService.endGameEndpoint(this.gameId, this.authService.getUserId()).subscribe(data => {});
              this.looserScreen = true;
              this.toastr.show('Perdiste :(', 'Fin del juego');
              /*setTimeout(() => {
                window.location.reload();
              }, 2000)*/
            }
          } else {
            this.board[data.data[1][0]][data.data[1][1]] = 'm';
            this.playerTurn = data.data[2];
            this.echoService.attackFailedEndpoint(false, data.data[2], data.data[1], data.data[3]).subscribe(data =>{
            })
          }
        }
      })

      this.echoService.attackSuccessEvent((data) => {
        console.log(data);
        console.log(data.data);
        console.log(this.authService.getUserId());
        console.log(this.enemyId);
        if(data.data[3] == this.authService.getUserId() && data.data[0] == true){
          this.enemyBoard[data.data[2][0]][data.data[2][1]] = 'h';
          //this.playerTurn = data.data[3];
          this.enemyBoats--;
          this.playerTurn = this.enemyId //En caso de que el profe quiera que el turno se pase al sig jugador aun así acertaces el tiro
          this.shooting = false;
          this.toastr.info('Le diste! Tu turno continua!', 'Ataque Exitoso');
        }
      })

      this.echoService.attackFailedEvent((data) => {
        if(data.data[3] == this.authService.getUserId() && data.data[0] == false){
          this.enemyBoard[data.data[2][0]][data.data[2][1]] = 'm';
          this.playerTurn = data.data[2];
          this.shooting = false;
          this.toastr.error('La fallaste!', 'Ataque Fallido');
        }
      })

      this.echoService.alertWinner((data) => {
        if(data.data == this.authService.getUserId()){
          this.gameFinished = true;
          this.winnerScreen = true;
          this.toastr.success('Ganaste :D', 'Fin del juego');
          /*setTimeout(() => {
            window.location.reload();
          }, 2000)*/
        }
      })


    }, 2000)
  }

  ngOnDestroy(){
    window.addEventListener('beforeunload', (event) => {
      if (!this.gameFinished){
        this.abortGame()
      }
    })
  }

   placeRandomShips(board: string[][], numShips: number) {
    for (let i = 0; i < numShips; i++) {
      let row, col;
      do {
        row = Math.floor(Math.random() * 8);
        col = Math.floor(Math.random() * 5);
      } while (board[row][col] === 's');
      board[row][col] = 's';
    }
  }

  defineEnemyId(){
    if (this.myId == localStorage.getItem('player1')){
      return localStorage.getItem('player2');
    } else {
      return localStorage.getItem('player1');
    }
  }

  attackEnemy(i: number, j: number){
    console.log('attacking');
    this.shooting = true;
    console.log(this.enemyBoard)
    let cell= [i, j];
    this.echoService.attackEndpoint(this.gameId, this.enemyId, this.myId, cell).subscribe(data => {
    })
  }

  abortGame(){
    let userConfirm = confirm('¿Estás seguro que deseas abandonar el juego? Perderás la partida :(');
    if(userConfirm){
      this.echoService.endGameEndpoint(this.gameId, this.myId).subscribe(data => {
        this.gameFinished = true;
        this.looserScreen = true;
        this.toastr.show('Juego abandonado :(', 'Abortado');
        /*setTimeout(() => {
          window.location.reload();
        }, 2000)*/
      })
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    if (!this.gameFinished) {
      this.abortGame();
    }
  }


}
