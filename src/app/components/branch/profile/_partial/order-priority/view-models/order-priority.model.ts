import { DeliveryTimeStatus } from "src/app/enum/delivery-time-status"
import { DistanceStatus } from "src/app/enum/distance-status"

export class OrderPriorityViewModel {

    ID: number
    BranchName: string
    BranchID: number
    DistanceStatus: DistanceStatus
    DistanceStatusName: string
    DeliveryTimeStatus: DeliveryTimeStatus
    DeliveryTimeStatusName:string
    Priority:number
}