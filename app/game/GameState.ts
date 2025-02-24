import { Socket } from 'socket.io-client';

export interface Player {
  id: string;
  x: number;
  y: number;
  color: string;
}

export class GameState {
  private players: Map<string, Player>;
  private socket: Socket;
  private localPlayerId: string | null;

  constructor(socket: Socket) {
    this.players = new Map();
    this.socket = socket;
    this.localPlayerId = null;
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('connect', () => {
      if (!this.socket.id) return;
      
      this.localPlayerId = this.socket.id;
      const player: Player = {
        id: this.socket.id,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        color: this.getRandomColor(),
      };
      
      this.addPlayer(this.socket.id, player);
      
      // Notify other players
      this.socket.emit('player:join', {
        x: player.x,
        y: player.y,
        color: player.color,
      });
    });

    this.socket.on('players:current', (players: Player[]) => {
      players.forEach(player => this.addPlayer(player.id, player));
    });

    this.socket.on('player:joined', (player: Player) => {
      this.addPlayer(player.id, player);
    });

    this.socket.on('player:moved', ({ id, position }) => {
      const player = this.players.get(id);
      if (player) {
        player.x = position.x;
        player.y = position.y;
      }
    });

    this.socket.on('player:left', (playerId: string) => {
      this.players.delete(playerId);
    });
  }

  public movePlayer(x: number, y: number) {
    if (!this.localPlayerId) return;
    
    const player = this.players.get(this.localPlayerId);
    if (player) {
      player.x = x;
      player.y = y;
      this.socket.emit('player:move', { x, y });
    }
  }

  public getPlayers(): Player[] {
    return Array.from(this.players.values());
  }

  public getLocalPlayer(): Player | undefined {
    return this.localPlayerId ? this.players.get(this.localPlayerId) : undefined;
  }

  private addPlayer(id: string, player: Player) {
    this.players.set(id, player);
  }

  private getRandomColor(): string {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
} 