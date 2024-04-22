import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import * as Pusher from 'pusher-js';

window.Pusher = Pusher;

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
