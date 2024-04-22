import { Injectable } from '@angular/core';
import {UserService} from "@services/UserServices/user.service";
import {catchError, map, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly userservice: UserService
  ) { }

  saveTokenResponse(jwt: string, user: any) {
    if (typeof window !== 'undefined') {
      const userString = JSON.stringify(user)
      localStorage.setItem('user', userString)
      localStorage.setItem('access_token', jwt)
    }
  }

  isAuthenticated(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return of(false);
    }
    return this.userservice.authenticate().pipe(
      map(() => true),
      catchError(() => {
        return of(false);
      })
    );
  }

  getUserId(){
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user')
      if(user){
        const userParsed = JSON.parse(user as string)
        const userId = userParsed.id
        return userId
      }
      return null
    }
  }

  getUserName(){
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user')
      if(user){
        const userParsed = JSON.parse(user as string)
        const userName = userParsed.name
        return userName
      }
      return null
    }
  }

  getUserEmail(){
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user')
      if(user){
        const userParsed = JSON.parse(user as string)
        const userEmail = userParsed.email
        return userEmail
      }
      return null
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token')
    }
    return null
  }

  resetAll(){
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('gameId');
      localStorage.removeItem('player1');
      localStorage.removeItem('player2');
    }
  }

  logout(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (typeof window !== 'undefined') {
        this.userservice.logoutuser().subscribe(
          (res: any) => {
            if (res.status === true) {
              localStorage.removeItem('access_token');
              localStorage.removeItem('user');
              localStorage.removeItem('gameId');
              localStorage.removeItem('player1');
              localStorage.removeItem('player2');
              resolve(true);
            } else {
              resolve(false);
            }
          },
          error => {
            resolve(false);
          }
        );
      } else {
        resolve(false);
      }
    });
  }
}
