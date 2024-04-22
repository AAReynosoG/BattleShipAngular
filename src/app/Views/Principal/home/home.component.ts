import { Component, HostListener } from '@angular/core';
import {EchoService} from "@services/EchoService/echo.service";
import {LoaderTypeOneComponent} from "@components/Loaders/loader-type-one/loader-type-one.component";
import {NgIf} from "@angular/common";
import {GameInstanceService} from "@services/GameInstance/game-instance.service";
import {RouterLink} from "@angular/router";
import {AuthService} from "@services/AuthService/auth.service";
import {Router} from "@angular/router";
import { HistoryComponent } from '@components/game/history/history.component';
import {ToastrService} from "ngx-toastr";
import {environment} from "@environments/environment";
import {BoardComponent} from "../../Board/board/board.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LoaderTypeOneComponent,
    NgIf,
    HistoryComponent,
    RouterLink,
    BoardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  load1: Boolean = false;
  load2: Boolean = false;
  joiningGame: Boolean = false;
    showHistory: Boolean = false;
    userName: string = ''
  eventSource: EventSource | null = null;
    showBoard: Boolean = false;


  constructor(
    private authService: AuthService,
    private router: Router,
    private gameInstanceService: GameInstanceService,
    private echoService: EchoService,
    private toast: ToastrService
) {}

  ngOnInit() {
    this.userName = this.authService.getUserName()
    setTimeout(() => {
      this.echoService.listentest((data) => {
        console.log('Echo data:', data);
        this.redirectToGame(data);
      })
    }, 1500);
  }

  ngOnDestroy(){
      if (this.load1 === true){
        this.gameInstanceService.dequeueGame().subscribe(data => {
          console.log('Dequeued game:', data);
          localStorage.removeItem('gameId');
        });
      }
    this.echoService.leaveChannel('lol');
  }

  redirectToGame(data: any) {
    if ( data.data.players[0] == this.authService.getUserId() || data.data.players[1] == this.authService.getUserId()
    ) {
      localStorage.setItem('gameId', data.data.gameId);
      this.toast.info(data.data.gameId, 'Game ID');
      localStorage.setItem('player1', data.data.players[0]);
      localStorage.setItem('player2', data.data.players[1]);
      localStorage.setItem('turn', data.data.players[1]);
      this.load1 = false;
      this.load2 = false;
      this.showBoard = true;
    }
  }

    closeHistory(){
        this.showHistory = false;
    }

    openHistory(){
        this.showHistory = true;
    }

  startQueue() {
    this.load1 = true;
    this.gameInstanceService.startQueue().subscribe(
      data => {
        localStorage.setItem('gameId', data.gameId);
      },
      err =>{
        if (err.status == 400){
          this.toast.error('Ya tienes un juego en cola o en partida. Finalizalo!', 'Error')
          this.load1 = false;
        }
      });
  }



  joinRandomGame() {
    this.load2 = true;
    this.joiningGame = true;
    this.tryJoinRandomGame();
  }

  tryJoinRandomGame() {
    if (!this.joiningGame) {
      return;
    }
    this.gameInstanceService.joinRandomGame().subscribe(
      data => {
        console.log('Joined game:', data);
        localStorage.setItem('gameId', data.gameId);
        this.toast.info(localStorage.getItem('gameId') || '', 'GAME IDDD');
        if (!data.game_found) {
          setTimeout(() => {
            this.tryJoinRandomGame();
          }, 2500);
        }
      },
      err => {
        if (err.error.game_found == false) {
          setTimeout(() => {
            this.tryJoinRandomGame();
          }, 2500);
        }else if(err.status == 400){
          this.toast.error('Ya tienes un juego en cola o en partida. Finalizalo!', 'Error')
          this.load2 = false;
          this.joiningGame = false;
        }
      }
    );
  }

  logout(){
    this.authService.logout().then((res) => {
      if(res){
        this.toast.success('Sesion cerrada. Hasta pronto!', 'Success')
        this.router.navigate(['/'])
      }
    })
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.load1) {
      this.load1 = false;
      this.gameInstanceService.dequeueGame().subscribe(data => {
        console.log('Dequeued game:', data);
        localStorage.removeItem('gameId');
      });
    }else if (event.key === 'Escape' && this.load2) {
      this.load2 = false;
      this.joiningGame = false;
    }
  }
}
