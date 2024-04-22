import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import Echo from 'laravel-echo';


declare global {
  interface Window { Echo: Echo | undefined; }
}
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor() { 
    if(!window.Echo){
      window.Echo = new Echo({
        broadcaster: 'pusher',
        key: environment.pusher.key,
        cluster: environment.pusher.cluster,
        encrypted: false,
        wsHost: window.location.hostname,
        wssPort: 6001,
        wsPort: 6001,
        disableStats: true,
      });
    }
  }

  leaveChannel(channel: string) {
    if(window.Echo){
      window.Echo.leave(channel);
    }
  }

  listen(channel: string, event: string, callback: Function) {
    window.Echo?.channel(channel).listen(event, callback);
  }

  lsitenToEvent(callback: (e: any) => void) {
    window.Echo?.channel('notify')
      .listen('.Notify.event', (e: any) => { 
        callback(e); 
      });
  }
 
  notifyAlert(callback: (e: any) => void) {
    window.Echo?.channel('alert')
      .listen('.Alert.event', (e: any) => { 
        callback(e); 
      });
  }

  WinnerAlert(callback: (e: any) => void) {
    window.Echo?.channel('winner')
      .listen('.Winner.event', (e: any) => { 
        callback(e); 
      });
  }
 
        
}
