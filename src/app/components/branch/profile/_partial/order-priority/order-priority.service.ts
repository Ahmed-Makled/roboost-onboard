import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

import { OrderPriorityEditViewModel } from './view-models/order-priority-edit.model';

@Injectable({
  providedIn: 'root'
})
export class OrderPriorityService {

  
  controller : string = "owner/OrderPriority";
  constructor(private _apiService:ApiService) { }
  
  get(branchID:number){
    return this._apiService.get(`/${this.controller}/Get?branchID=${branchID}`);
  }
  ChangePriority(OrderPriority:OrderPriorityEditViewModel  )
  {
    return this._apiService.update(`/Order/ChangePriority`,JSON.stringify(OrderPriority));
  }
}
