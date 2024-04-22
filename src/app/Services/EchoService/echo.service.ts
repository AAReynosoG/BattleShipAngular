import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import Echo from 'laravel-echo';
import { isPlatformBrowser } from '@angular/common';

import {HttpClient} from "@angular/common/http";
import { environment } from '@environments/environment';


declare global {
  interface Window {
    Echo: Echo | undefined;
    Pusher: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class EchoService {

  private testURL ="http://127.0.0.1:8000/api/sendevent"
  private echo?: Echo;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeEcho();
    }
  }

  public initializeEcho(): void {
    import('pusher-js').then((Pusher) => {
      window.Pusher = Pusher.default;
      this.setupEcho();
    });
  }

  private setupEcho(): void {
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: environment.pusher.key,
      cluster: environment.pusher.cluster,
      encrypted: true,
      disableStats: true,
      logToConsole: true,
    });
  }

  public leaveChannel(channel: string): void {
    this.echo?.leave(channel);
  }

  public listentest(callback: (e: any) => void) {
    this.echo?.channel('lol').listen('.lol', (e: any) => {
      callback(e);
    });
  }

  public attackEvent(callback: (e: any) => void) {
    this.echo?.channel('attack').listen('.attack', (e: any) => {
      callback(e);
    });
  }

  public attackSuccessEvent(callback: (e: any) => void){
    this.echo?.channel('attacksuccess').listen('.attacksuccess', (e: any) => {
      callback(e);
    });
  };

  public attackFailedEvent(callback: (e: any) => void){
    this.echo?.channel('attackfailed').listen('.attackfailed', (e: any) => {
      callback(e);
    });
  };

  public alertWinner(callback: (e: any) => void){
    this.echo?.channel('winner').listen('.winner', (e: any) => {
      callback(e);
    });
  }


attackEndpoint(gameId: string | null, playerAttacked: string | null, playerWhoAttacked: number | null, cell:number[] ) {
    return this.http.post(environment.attackURL, {
      gameId: gameId,
      playerAttacked: playerAttacked,
      playerWhoAttacked: playerWhoAttacked,
      cell: cell
    });
}

attackSuccessEndpoint(hited: Boolean | null, turn: string | null, cell:number[], playerWhoAttacked: number | null ) {
  return this.http.post(environment.attackSuccessURL, {
    hited: hited,
    turn: turn,
    cell: cell,
    playerWhoAttacked: playerWhoAttacked,
  });
}

  attackFailedEndpoint(hited: Boolean | null, turn: string | null, cell:number[], playerWhoAttacked: number | null ) {
    return this.http.post(environment.attackFailedURL, {
      hited: hited,
      turn: turn,
      cell: cell,
      playerWhoAttacked: playerWhoAttacked,
    });
  }

  endGameEndpoint(gameId: string | null, loser_id: number | null) {
    return this.http.put(environment.endGameURL, {
      gameId: gameId,
      loser_id: loser_id
    });
  }


}
