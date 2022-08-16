import { OrderRateOption } from "src/app/enum/order-rate-option";

export class TripOrderViewModel {
    ID: number;
    OrderNumber: string;
    Code:string
    PlannedDeliveryTime: Date
    DeliveryTime: Date
    Date: Date;
    CustomerName: string
    CustomerMobile: string
    Address: string
    PlannedLongitude: number
    PlannedLatitude: number
    Longitude: number
    Latitude: number
    Rate: OrderRateOption
    RateName: string
    Amount: number
    ServingTime: number
    Distance: number
    OrderDeliveryTime:number
    StatusColor:string;
    OrderPosition:number;
}