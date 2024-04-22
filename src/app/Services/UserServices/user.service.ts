import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserLogin, statusInterface, LoginResponseInterface, UserRegister} from "@models/User";
import {environment} from "@environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private readonly http: HttpClient
  ) { }

  login(data: UserLogin): Observable<LoginResponseInterface>{
    return this.http.post<LoginResponseInterface>(environment.loginURL, data)
  }

  logoutuser(): Observable<statusInterface>{
    return this.http.post<statusInterface>(environment.logoutURL, {})
  }

  authenticate(): Observable<statusInterface> {
    return this.http.get<statusInterface>(environment.authenticateURL)
  }

  register(data: UserRegister){
    return this.http.post<UserRegister>(environment.registerURL, data)
  }
}
