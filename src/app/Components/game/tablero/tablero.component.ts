import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AuthService } from '@services/AuthService/auth.service';
import { NotificationService } from '@services/WS/notification.service';

@Component({
  selector: 'app-tablero',
  standalone: true,
  imports: [
    CommonModule
],
  templateUrl: './tablero.component.html',
  styleUrl: './tablero.component.css'
})
export class TableroComponent {
    @Input() tablero: number[][] = [];
    @Output() recibirTablero: EventEmitter<number[][]> = new EventEmitter<number[][]>();
    myTurn = true;

    constructor(
        private readonly notificationService: NotificationService,
        private readonly auth: AuthService
    ) { }

    ngOnInit(){
        if(localStorage.getItem('tablero') === null){
            this.initGame()
            return
        }
        this.tablero = JSON.parse(localStorage.getItem('tablero') || '{}')
        this.listenToNotify()
        console.log("tablero original", this.tablero)

    }

    listenToNotify(){
        this.notificationService.lsitenToEvent((eventData) => {
            if(eventData.message.toString() === this.auth.getUserId().toString()){
            }else{
                console.log("NOS DISPARARON")
                this.recibirTablero.emit(this.tablero)
            }
        });
    }

    checkBoats(){
        let boats = 0;
        this.tablero.forEach(fila => {
            fila.forEach(casilla => {
                if (casilla === 1) boats++;
            });
        });
        return boats;
    }

    initGame(){
        localStorage.removeItem('tablero')
        for (let i = 0; i < 2; i++) {
            let fila = Math.floor(Math.random() * 8);
            let columna = Math.floor(Math.random() * 15);
            this.tablero[fila][columna] = 1;
        }
        localStorage.setItem('tablero', JSON.stringify(this.tablero));
        console.log(localStorage.getItem('tablero'))
    }
}
