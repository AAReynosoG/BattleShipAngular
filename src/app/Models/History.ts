export interface GameResponse {
  page: number;
  games: Game[];
}

export interface Game {
  id: number;
  status: string;
  created_at: string;
  player1_name: string;
  player1_id: number;
  player2_id: number;
  player2_name: string;
  winner_name: string;
  winner_id: number;
  player_id: number;
}
