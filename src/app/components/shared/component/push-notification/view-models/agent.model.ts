import { DeliveryStatus } from "src/app/enum/delivery-status"

export class AgentNotificationViewModel {
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