import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertComponent } from '@components/Alerts/alert/alert.component';
import { AuthService } from '@services/AuthService/auth.service';
import { GameInstanceService } from '@services/GameInstance/game-instance.service';
import { NotificationService } from '@services/WS/notification.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-tablero-rival',
  standalone: true,
  imports: [
    AlertComponent,
    CommonModule
    ],
  templateUrl: './tablero-rival.component.html',
  styleUrl: './tablero-rival.component.css'
})
export class TableroRivalComponent {
    constructor(
        private readonly gameInstance : GameInstanceService,
        private notificationService: NotificationService,
        private readonly auth: AuthService,
        private toast: ToastrService
    ) { }



    alert:boolean = false
    message: string = ''
    @Input() tablero_rival: number[][] = [];
    @Output() medirDisparo: EventEmitter<number[][]> = new EventEmitter<number[][]>();

    disableTablero: boolean = false
    myTurn: boolean = false

    ngOnInit(){
        this.listenToNotify();
        this.getMyTurn()
        this.getMyTurn()
        this.listenToAlert()
    }

    listenToAlert(){
        this.notificationService.notifyAlert((eventData) => {
            if(this.auth.getUserId() !== eventData.data){
                this.toast.show(eventData.message)
            }
        });
    }

    listenToNotify(){
        this.notificationService.lsitenToEvent((eventData) => {
            if(eventData.message.toString() === this.auth.getUserId().toString()){
                // jugador principal
                console.log("soy yo we")
                this.myTurn = false
            } else{
                // otro jugador
                this.myTurn = true
                this.medirDisparo.emit(eventData.data)
                console.log("mi Tablero", this.tablero_rival)
                console.log("donde me dispararon", eventData.data)
            }
        });
    }
    
    casilla_selected(fila: number, columna: number) {
        if(!this.myTurn || this.disableTablero) return 
        this.disableTablero = true
        this.tablero_rival[fila][columna] = 2  
        this.sendLocation(this.tablero_rival)
    }

    sendLocation(board: number[][]){
        console.log(localStorage.getItem('turn'))
        this.gameInstance.sendBoard(localStorage.getItem('gameId') || '', board, localStorage.getItem('turn') || '').subscribe(
            data => {
                this.disableTablero = false
            }
        )
    }

    getMyTurn(){
        console.log("GET MY TURN", localStorage.getItem('turn'))
        if(localStorage.getItem('turn') !== null){
            this.myTurn = true
        }
    }

    showAlert(message: string){
        this.message = message
        this.alert = true
        setTimeout(() => {
            this.alert = false
        }, 3000);
    }
}
