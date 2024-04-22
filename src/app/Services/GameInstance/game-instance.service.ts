import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameInstanceService {

  constructor(
    private http: HttpClient
  ) {
  }

  startQueue(): Observable<any> {
    return this.http.post<any>(environment.queueGameURL, {player1_id: 1});
  }

  joinRandomGame(): Observable<any> {
    return this.http.put<any>(environment.joinRandomGameURL, {player2_id: 2});
  }

  endGame(losser_id: string, gameId: string): Observable<any> {
    return this.http.put<any>(environment.endGameURL, {losser_id: losser_id, gameId: gameId});
  }

  dequeueGame(): Observable<any> {
    return this.http.post<any>(environment.dequeueGameURL, {gameId: localStorage.getItem('gameId')});
  }

  cancelRandomQueue(): Observable<any> {
    return this.http.post<any>(environment.cancelRandomQueueURL, {player_id: 2});
  }

  sendBoard(gameId: string, board: number[][], turn: string): Observable<any>{
    return this.http.post<any>(environment.sendBoard, {gameId: gameId, board: board, turn: turn});
  }

    sendAlert(): Observable<any>{
        return this.http.post<any>(environment.notify, {});
    }

}
