import { CommonModule } from '@angular/common';
import {Component, Output, Input, EventEmitter, signal, inject} from '@angular/core';
import { Game } from '@models/History';
import { HistoryService } from '@services/Game/history.service';
import {filter} from "rxjs";


@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
        CommonModule,
    ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {

    public historyService = inject(HistoryService)

    public games = signal<Game[]>([]);
    public currentPage = signal(1);
    @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

    ngOnInit() {
      this.loadPage(this.currentPage())
    }

    loadPage(page: number){
      this.historyService.getHistory(page)
        .pipe(
          filter(games => games.games.length > 0)
        )
        .subscribe(games => {
          this.games.set(games.games);
          this.currentPage.set(page);
        })
    }

  closeModal() {
    this.close.emit(true);
  }
}
