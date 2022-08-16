import { DeliveryTimeStatus } from "src/app/enum/delivery-time-status"
import { DistanceStatus } from "src/app/enum/distance-status"

export class AlternativeOrderViewModel {
    OrderID  :number
    TripID  :number
    DeliveryTimeStatus  :DeliveryTimeStatus
    DistanceStatus  :DistanceStatus
    DeliveryTimeStatusName :string
    DistanceStatusName :string
    Priority  :number
    IsAddedToTrip:boolean  
    PlannedLongitude    :number
    PlannedLatitude :number
    BranchLongitude:number
    BranchLatitude :number
    BranchName:string 
    BranchID:number
    TripNumber :number
    OrderNumber :string 
    DistanceFromFirstOrder :number
    DistanceFromBranch:number
    OrderCode:string
}