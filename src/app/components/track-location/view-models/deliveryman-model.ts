import { DeliveryStatus } from "src/app/enum/delivery-status"
import { SelectItem } from "src/app/model/shared/select-view-model"

export class DeliverymanViewModel {
  ID: number
  Name: string
  StatusName: string
  StatusID: DeliveryStatus
  StatusColor: string
  Image: string
  BranchID: number
  BranchName: string
  AreaID: number
  Longitude: number
  Latitude: number
  Selected: boolean = true
  IsStoreSelect:boolean =false
}
export class AgentFilterViewModel {
  FiltterByList = [
    { ID: DeliveryStatus.AVAILABLE, Name: "system.available", Selected: true ,bg:"#00C853"},
    { ID: DeliveryStatus.ON_DUTY, Name: "system.on-duty", Selected: false,bg:"#03a8ff" },
    { ID: DeliveryStatus.PENALIZED, Name: "system.penalize", Selected: false ,bg:"#000"},
    { ID: DeliveryStatus.Break, Name: "system.break", Selected: false ,bg:"#ffc400" }
  ];
}
export class TaskFilterViewModel {
  UnAssignTasks:boolean = true
  AssignTask : boolean = true
}