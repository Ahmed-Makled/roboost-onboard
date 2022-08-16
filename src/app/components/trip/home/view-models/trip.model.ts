import { TripRateOption } from "src/app/enum/trip-rate-option"
import { TripStatus } from "src/app/enum/trip-status"

export class TripViewModel {
    ID: number
    Number: number
    DeliverymanID: number
    DeliverymanName: string
    DeliverymanImage: string
    Status: TripStatus
    StatusName: string
    StartTime: Date
    CloseTime: Date
    CreatedDate: Date
    SpentTime:number;
    ExcelantMaxTime:number;
    GoodMaxTime:number;
    LateMaxTime:number;
    OrdersCount: number;
    Amount: number;
    IsSelected: boolean;
    IsDeleting: boolean;
    TripRateOption: TripRateOption;
    RateStatusName: string;
    RateStatus: number;
    PlannedCompleteTimeInt: number;
    PlannedCompleteTime: Date;
    ExpectedRateName:string;
    ExpectedRateColor:string;
    IsPaused :boolean;
    Duration:number;
    PerformanceColor:string;
    StatusColor:string;
    IsSpecialTrip:boolean;
    BranchID:number
    BranchName:string;
    IsRealTime:boolean = false
    PlannedDistance:number
    ArrivalTimeSecond:number
    PickupTime?:Date
}