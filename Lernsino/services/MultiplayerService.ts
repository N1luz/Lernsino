
import { ChatMessage, UserStats } from '../types';

type MessageListener = (msg: ChatMessage) => void;
type ConnectionListener = (isConnected: boolean) => void;
type StateListener = (stats: UserStats) => void;

class MultiplayerService {
  private socket: WebSocket | null = null;
  private channel: BroadcastChannel | null = null;
  
  private messageListeners: MessageListener[] = [];
  private connectionListeners: ConnectionListener[] = [];
  private stateListeners: StateListener[] = [];
  
  private isConnected: boolean = false;
  private pendingLogin: string | null = null;
  private reconnectInterval: any = null;
  
  // Dynamically determine URL based on environment
  private getBackendUrl() {
      // Access Vite environment variables
      // We cast to any to avoid TS errors if types aren't fully set up for import.meta.env
      const env = (import.meta as any).env;
      
      if (env && env.VITE_WS_URL) {
          return env.VITE_WS_URL;
      }
      
      // Fallback for local development
      return 'ws://localhost:8080';
  }

  constructor() {
    this.init();
  }

  private init() {
    try {
        const url = this.getBackendUrl();
        console.log("🔌 Connecting to:", url);
        
        this.socket = new WebSocket(url);
        
        this.socket.onopen = () => {
            console.log("✅ Connected to Backend DB");
            this.setConnectionStatus(true);
            if (this.reconnectInterval) {
                clearInterval(this.reconnectInterval);
                this.reconnectInterval = null;
            }
            if (this.pendingLogin) {
                this.login(this.pendingLogin);
            }
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                if (data.type === 'INIT_STATE') {
                    console.log("📥 Received State from DB", data.stats);
                    this.stateListeners.forEach(l => l(data.stats));
                    return;
                }

                if (data.id && data.text) {
                    this.messageListeners.forEach(l => l(data as ChatMessage));
                }

            } catch (e) {
                console.error("Invalid msg format", e);
            }
        };

        this.socket.onerror = () => {
            console.log("❌ Socket Error");
            // Do not set connected false immediately, wait for close
        };
        
        this.socket.onclose = () => {
            console.log("🔌 Socket Closed");
            this.setConnectionStatus(false);
            this.initLocalMode();
            
            // Attempt reconnect if not already trying
            if (!this.reconnectInterval) {
                this.reconnectInterval = setInterval(() => {
                    console.log("🔄 Attempting reconnect...");
                    this.init();
                }, 5000);
            }
        };

    } catch (e) {
        this.initLocalMode();
    }
  }

  private initLocalMode() {
      if (this.channel) return;
      console.log("⚠️ Using Local Mode (No persistence)");
      this.channel = new BroadcastChannel('lerncasino_global_chat');
      this.channel.onmessage = (event) => {
          this.messageListeners.forEach(l => l(event.data as ChatMessage));
      };
  }

  private setConnectionStatus(status: boolean) {
      this.isConnected = status;
      this.connectionListeners.forEach(l => l(status));
  }

  public login(username: string) {
      this.pendingLogin = username;
      if (this.isConnected && this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'LOGIN', username }));
      }
  }

  public updateStats(stats: UserStats) {
      if (this.isConnected && this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'UPDATE_STATS', stats }));
      }
  }

  public sendMessage(msg: ChatMessage) {
      if (this.isConnected && this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify(msg));
      } else if (this.channel) {
          this.channel.postMessage(msg);
      }
  }

  public subscribeToMessages(listener: MessageListener) {
      this.messageListeners.push(listener);
      return () => { this.messageListeners = this.messageListeners.filter(l => l !== listener); };
  }

  public subscribeToConnection(listener: ConnectionListener) {
      this.connectionListeners.push(listener);
      listener(this.isConnected);
      return () => { this.connectionListeners = this.connectionListeners.filter(l => l !== listener); };
  }

  public subscribeToState(listener: StateListener) {
      this.stateListeners.push(listener);
      return () => { this.stateListeners = this.stateListeners.filter(l => l !== listener); };
  }
}

export const multiplayerService = new MultiplayerService();
