// import { Injectable } from '@angular/core';
// import * as signalR from  "@microsoft/signalr" ;
// import * as moment from 'moment';
// import { from } from 'rxjs';
// import { environment } from 'src/environments/environment';
// import { TrackedDeliverymanViewModel } from '../components/deliveryman/track-location/view-models/tracked-deliveryman.model';
// import { ApplicationRole } from '../enum/application-role';
// import { TokenService } from './token.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class DispatcherHub {
//   constructor(private tokenService: TokenService) {
//   }
//   private hubConnection: signalR.HubConnection
//  private hubName :string ="DispatcherHub"
//   public startConnection = (storesID: number[],role: ApplicationRole ) => {
//     this.hubConnection = new signalR.HubConnectionBuilder()
//       .withUrl(`${environment.api}/${this.hubName}?storesID=${storesID}&role=${role}`, {
//         accessTokenFactory: () => this.tokenService.getToken()
//       })
//       .withAutomaticReconnect()
//       .build();
//       return this.hubConnection.start()
//   }
//   public ReceiveUpdatedPickup(method: (pickup:TrackedPickupViewModel) => void) {
//     this.hubConnection.on('SendUpdatedPickups', (order:TrackedPickupViewModel) => {
//       // console.log(order);

//       method(order);
//     });
//   }
//   public SayHii(method: (pickup:any) => void) {

//     this.hubConnection.on('SayHii', (order:any) => {
//       method(order);
//     });
//   }
//   public ReceiveUpdatedTrip(method: (trip: TrackedTripViewModel) => void) {
//     this.hubConnection.on('SendUpdatedTrip', (trip: TrackedTripViewModel) => {
//       method(trip);
//     });
//   }
//   public ReceiveUpdatedDeliveryman(method: (deliveryman: TrackedDeliverymanViewModel) => void) {
//     this.hubConnection.on('SendUpdatedDeliveryman', (deliveryman: TrackedDeliverymanViewModel) => {
//       method(deliveryman);
//     });
//   }
//   public stopConnection() {
//     this.hubConnection.stop()
//   }
//   public OnStopConnection() {
//     this.hubConnection.on('Stop', () => {
//       this.hubConnection.stop()
//     });
//   }
//   public UpdateTrackedBranches(branches: number[]):Promise<any> {
//     return this.hubConnection.invoke("UpdateTrackedBranches", branches)
//   }
//   public IsConnected(): boolean {
//     return this.hubConnection.state == signalR.HubConnectionState.Connected
//   }
// }