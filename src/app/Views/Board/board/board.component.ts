import {Component, inject} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {AuthService} from "@services/AuthService/auth.service";
import {EchoService} from "@services/EchoService/echo.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {LoaderTypeOneComponent} from "@components/Loaders/loader-type-one/loader-type-one.component";

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    LoaderTypeOneComponent,
    NgIf
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

  board: string[][] = Array.from({length: 8}, () => Array(5).fill('w'));
  enemyBoard: string[][] = Array.from({length: 8}, () => Array(5).fill('w'));

  playerTurn = localStorage.getItem('turn');
  gameId = localStorage.getItem('gameId');
  myId = this.authService.getUserId();
  enemyId = this.defineEnemyId();
  boats = 5;



  ngOnInit(){
    this.placeRandomShips(this.board, this.boats);
    setTimeout(() => {
      this.echoService.attackEvent((data) => {

        if(data.data[2] == this.authService.getUserId()){
          if(this.board[data.data[1][0]][data.data[1][1]] == 's'){
            this.playerTurn = data.data[3]
            this.board[data.data[1][0]][data.data[1][1]] = 'h';
            this.boats--;
            this.echoService.attackSuccessEndpoint(true, data.data[3], data.data[1], data.data[3]).subscribe(data => {
            });
            if(this.boats == 0) {
              this.echoService.endGameEndpoint(this.gameId, this.authService.getUserId()).subscribe(data => {});
              this.toastr.show('Perdiste :(', 'Fin del juego');
              this.gameFinished = true;
              setTimeout(() => {
                window.location.reload();
              }, 3000)
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
        if(data.data[3] == this.authService.getUserId() && data.data[0] == true){
          this.enemyBoard[data.data[2][0]][data.data[2][1]] = 'h';
          this.playerTurn = data.data[3];
          this.shooting = false;
          this.toastr.success('Le diste!', 'Success Attack');
        }
      })

      this.echoService.attackFailedEvent((data) => {
        if(data.data[3] == this.authService.getUserId() && data.data[0] == false){
          this.enemyBoard[data.data[2][0]][data.data[2][1]] = 'm';
          this.playerTurn = data.data[2];
          this.shooting = false;
          this.toastr.error('La fallaste kpo!', 'Failed Attack');
        }
      })

      this.echoService.alertWinner((data) => {
        console.log(data);
        if(data.data == this.authService.getUserId()){
          this.toastr.success('Ganaste :D', 'Fin del juego');
          this.gameFinished = true;
          setTimeout(() => {
            window.location.reload();
          }, 3000)
        }
      })


    }, 2000)
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
    this.shooting = true;
    let cell= [i, j];
    this.echoService.attackEndpoint(this.gameId, this.enemyId, this.myId, cell).subscribe(data => {
      this.shooting = false;
    })
  }

  abortGame(){
    let userConfirm = confirm('¿Estás seguro que deseas abandonar el juego? Perderás la partida :(');
    if(userConfirm){
      this.echoService.endGameEndpoint(this.gameId, this.myId).subscribe(data => {
        this.toastr.show('Juego abandonado :(', 'Abortado');
        this.gameFinished = true;
        setTimeout(() => {
          window.location.reload();
        }, 2000)
      })
    }
  }


}
