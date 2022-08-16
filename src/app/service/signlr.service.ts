import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr" 
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  constructor( private tokenService: TokenService) {
    
}
private hubConnection: signalR.HubConnection

  public startConnection = (deliverymen: number[] = []) => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.api}/LocationTrackingHub?deliverymen=${deliverymen}`, {
        accessTokenFactory: () => this.tokenService.getToken()
      })
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }
  public ReceiveLocations(method: (locations) => void) {
    this.hubConnection.on('ReceiveLocations', (locations) => {
      method(locations);
    });
    

  }
  public OnstopConnection() {
    this.hubConnection.on('Stop', () => {
      this.StopConnection();
    });
  }
  public StopConnection() {
    this.hubConnection.stop()
  };
  public UpdateDeliverymen(deliverymen: number[] = []) {
    this.hubConnection.invoke("UpdateTrackedDeliverymenAsync", deliverymen).then(res => {
    })
  }
}