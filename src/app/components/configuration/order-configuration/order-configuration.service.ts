import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { CreateTripConfigurationViewModel } from './view-models/create-trip-configuration.model';
import { DistanceOrderConfigurationViewModel } from './view-models/distance-order-configuration.model';
import { OrderKPIsConfigurationViewModel } from './view-models/order-kpi-configuration.model';
import { TimeOrderConfigurationViewModel } from './view-models/time-order-configuration.model';

@Injectable({
  providedIn: 'root'
})
export class OrderConfiguratioService {

  
  controller : string = "Branch";
  constructor(private _apiService:ApiService) { }
  getDistanceConfiguration(){
    return this._apiService.get(`/${this.controller}/GetDistanceOrderConfigurations`);
  }
 
  updateDistanceConfiguration(list:DistanceOrderConfigurationViewModel[]){
    return this._apiService.update(`/${this.controller}/UpdateDistanceOrderConfig`,list);
  }
 
  getTimeConfiguration(){
    return this._apiService.get(`/${this.controller}/GetTimeOrderConfigurations`);
  }
 
  updateTimeConfiguration(list:TimeOrderConfigurationViewModel[]){
    return this._apiService.update(`/${this.controller}/UpdateTimeOrderConfig`,list);
  }
 
  getKPIConfiguration(){
    return this._apiService.get(`/${this.controller}/GetKPIsConfigurations`);
  }
 
  updateKPIConfiguration(list:OrderKPIsConfigurationViewModel[]){
    return this._apiService.update(`/${this.controller}/UpdateKPIsOrderConfig`,list);
  }
  
  getCreateTripConfigurations(){
    return this._apiService.get(`/${this.controller}/GetCreateTripConfigurations`);
  }
 
  updateCreateTripConfig(list:CreateTripConfigurationViewModel[]){
    return this._apiService.update(`/${this.controller}/UpdateCreateTripConfig`,list);
  }
}
