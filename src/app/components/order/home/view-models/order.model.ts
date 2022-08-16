import { OrderRateOption } from "src/app/enum/order-rate-option"
import { OrderStatus } from "src/app/enum/order-status.enum"

export class OrderViewModel {
    ID:number
    TripID:number
    TripNumber:number
    CustomerName:string
    CustomerMobile:string
    CustomerID:number
    CityName:string
    Address:string
    PlannedLongitude :number
    PlannedLatitude  :number;
    Longitude : number
    Latitude:number
    HasGoogleLocation:boolean
    Code:string
    OrderNumber:string
    Weight:string
    ServicesCount:number
    Distance:number
    PlannedDistance:number
    Priority:number
    Status:OrderStatus
    StatusName:string
    DeliveryTimeStatus:number
    DistanceStatus:number
    DeliveryTimeStatusName:string
    DistanceStatusName:string
    PlannedPreperationDate:Date
    PlannedDeliveryTime:Date
    CreatedDate:Date
    IsActive:boolean
    IsPaused:boolean
    RemainingTime:number
    DeliveryTime:Date
    IsDeleting:boolean ;
    OrderDeliveryTime:number;
    Rate :OrderRateOption
    RateName :string
    DeliverymanName:string;
    DeliverymanID :number;
    StatusColor:string;
    BranchName:string;
    IsFastOrder:boolean;
}