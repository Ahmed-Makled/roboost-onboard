import { Injectable } from '@angular/core';
import { DispatchService } from 'src/app/components/dispatch/page/dispatch.service';
import { DispatchAgentViewModel, DispatchTripViewModel } from 'src/app/components/dispatch/page/view-models/dispatch.model';
import { TripStatus } from 'src/app/enum/trip-status';
import { StatusUtilsService } from '../../../../../service/status.service';

@Injectable({
  providedIn: 'root',
})

export class TripUtilsService {

  constructor(
    private _dispatchService: DispatchService, 
  ) { }
  
  isTripDelivered(id: number) {
    return this._dispatchService.trips.find(i => i.ID == id).Status == TripStatus.DELIVERED
  }
  sentToAgent(item: DispatchTripViewModel,agent: DispatchAgentViewModel){
    item.DeliverymanID = agent.ID
    item.DeliverymanName = agent.Name
    item.Status = TripStatus.SEND_TO_DELIVERYMAN
  }
  getTripListForActions(): DispatchTripViewModel[] {
    let trips: DispatchTripViewModel[];
    trips = this._dispatchService.trips.filter((i) => (this._dispatchService.selectedOrder.IsTransite ? true : i.BranchID == this._dispatchService.selectedOrder.BranchID) && i.ID != this._dispatchService.pageUtils.oldTripID)
    if (this._dispatchService.pageUtils.tripActionSearchValue)
      return trips.filter(i => i.DeliverymanName.toLowerCase().includes(this._dispatchService.pageUtils.tripActionSearchValue.toLowerCase())
        || i.Number.toString().includes(this._dispatchService.pageUtils.tripActionSearchValue))
    else return trips
  }
 
}
