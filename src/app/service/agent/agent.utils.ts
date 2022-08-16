import { Injectable } from '@angular/core';
import { DeliverymanViewModel } from 'src/app/components/deliveryman/home/view-models/deliveryman.model';
import { DispatchAgentViewModel } from 'src/app/components/dispatch/page/view-models/dispatch.model';
import { DeliveryStatus } from 'src/app/enum/delivery-status';
import { StatusUtilsService } from '../status.service';

@Injectable({
  providedIn: 'root',
})

export class AgentUtilsService {

  constructor(private _statusUtils: StatusUtilsService) { }
  
  setAsAvailable(item:DispatchAgentViewModel){
    item.StatusID = DeliveryStatus.AVAILABLE
    item.StatusColor = this._statusUtils.getAgentStausColor(DeliveryStatus.AVAILABLE)
  }
  startBreak(item:DeliverymanViewModel){
    item.StatusID = DeliveryStatus.Break;
    item.StatusName = DeliveryStatus[item.StatusID];
    item.QueueNo = null;
    item.ColorStatus = this._statusUtils.getAgentStausColor(item.StatusID);
  }

  setAsOnDuty(agents:DispatchAgentViewModel[]) {
    agents.forEach(element => {
      element.StatusID = DeliveryStatus.ON_DUTY
      element.StatusColor = this._statusUtils.getAgentStausColor(element.StatusID)
    });
  }
}
