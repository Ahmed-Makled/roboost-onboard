import { OrderStatus } from "src/app/enum/order-status.enum";
import { TripStatus } from "src/app/enum/trip-status";

export class CustomerOrdersViewModel {
    ID: number;
    BranchName: string;
    OrderNumber: string;
    Date: Date;
    DeliveryTime: Date;
    Duration: number;
    BranchID: number;
    Address: string;
    Status: OrderStatus;
    StatusName: string;
    Rate: number;
    RateName: string;
    RateColore:string;
    ItemsCount: number;
    Amount: number
    TripStatus :TripStatus 
     DeliverymanName :string
     DeliverymanMobile :string
     DeliverymanID :number
     Code :string
}