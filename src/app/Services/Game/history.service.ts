import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import {Game, GameResponse} from '@models/History';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private readonly http: HttpClient) { }

    getHistory(page: number):Observable<GameResponse>{
        return this.http.get<GameResponse>(environment.historyGames, {params: {page: page}})
    }
}
