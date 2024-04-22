import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './Views/Principal/home/home.component';
import { MenuComponent } from './Layouts/Principal/menu/menu.component';
import { LoginComponent } from './Views/Auth/login/login.component';
import { RegisterComponent } from './Views/Auth/register/register.component';
import { JuegoComponent } from './Views/Principal/juego/juego.component';
import { AuthGuard } from '@guards/AuthGuard/auth.guard';
import { DesauthGuard } from '@guards/DesauthGuard/desauth.guard';
import {BoardComponent} from "./Views/Board/board/board.component";


export const routes: Routes = [
  {
   path: '',
    component: AppComponent,
    canActivate: [DesauthGuard],
    children:[
      {
        path: '',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      }
    ]
  },
  {
    path: '',
    component: MenuComponent,
    canActivate: [AuthGuard],
    children:[
      {
        path: 'menu',
        component: HomeComponent
      }
    ]
  },
  {
    path: 'mark',
    component: MenuComponent,
    children:[
      {
        path: 'game',
        component: JuegoComponent
      },
      {
        path: 'board',
        component: BoardComponent
      }
    ]
  }
];
