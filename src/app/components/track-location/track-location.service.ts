import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrackLocationService {

  constructor(private apiService: ApiService) { }


  getDeliverymen() {
    return this.apiService.get(`/Deliveryman/GetDispatcherDeliverymen`);
  }
  snapToRoads(path:string) {
    return this.apiService.getFromGoogle(`https://roads.googleapis.com/v1/snapToRoads?path=${path}&interpolate=true&key=${environment.mapApiKey}`);
  }

}
