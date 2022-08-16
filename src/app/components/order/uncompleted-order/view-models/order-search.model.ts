import { TripRateOption } from "src/app/enum/trip-rate-option";

export class OrderSearchViewModel {
    ID?: number;
    TripNumber?: number;
    OrderNumber?: string;
    CustomerName?: string;
    CustomerMobile?: string;
    CustomerNumber?: string;
    FromDate: any = new Date();
    ToDate: any = new Date();
    Status: number;
    Performance: number;
    branchID?: number;
    DeliverymanID?: number;
    EnrollID: String;
    IsFastOrder?: boolean
    ServiceID?: number
    TripRate?: TripRateOption
    IsTransite: boolean;
}