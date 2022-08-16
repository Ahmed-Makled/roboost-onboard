import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TripDetailsService {

  controller: string = "Trip";
  constructor(private _apiService: ApiService) { }

  get(id) {
    // let  d = this._apiService.get(`/${this.controller}/TripDetails?code=${id}`);
    // d.subscribe(res=>{
    //   console.log("main",res);
    // })
    return this._apiService.get(`/${this.controller}/TripDetails?code=${id}`);
    // https://api.tayar.app/trip/TripDetails?code=T2H4ZsbeU-
  }
  snapToRoads(path:string) {
    return this._apiService.getFromGoogle(`https://roads.googleapis.com/v1/snapToRoads?path=${path}&interpolate=true&key=${environment.mapApiKey}`);
  }
  RemoveOrder(id) {
    return this._apiService.get(`Order/RemoveFromTrip?id=${id}`);
  }

}
