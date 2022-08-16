import { Injectable } from '@angular/core';
import * as signalR from  "@microsoft/signalr" ;
import { environment } from 'src/environments/environment';
import { TokenService } from '../token.service';

@Injectable({
  providedIn: 'root'
})
export class DispatcherHub {
  constructor(private tokenService: TokenService) {
  }
  private hubConnection: signalR.HubConnection

  private hubName :string ="DispatcherHub"
 

  public stopConnection() {
    this.hubConnection.stop()
  }
  public OnStopConnection() {
    this.hubConnection.on('Stop', () => {
      this.hubConnection.stop()
    });
  }
  public IsConnected(): boolean {
    return this.hubConnection.state == signalR.HubConnectionState.Connected
  }
}