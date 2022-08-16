import { TripRateOption } from "src/app/enum/trip-rate-option";
import { TripStatus } from "src/app/enum/trip-status";
import { TripValidationRequestEnum } from "./validation-request.enum";

export class TripValidationRequestViewModel {
    ID: number
    TripID:number;
    TripNumber: number;
    TripStatus: TripStatus;
    TripStatusName: string;
    StartTime: Date
    CloseTime: Date
    CreatedDate: Date;
    OrdersCount: number;
    Amount: number;
    TripRateStatus: number;
    TripRateStatusName: string;  
    Duration:number;
    IsSpecialTrip:boolean;
    DeliverymanID: number
    DeliverymanName: string
    DeliverymanImage: string
    BranchID:Number;
    BranchName:string;
    RequestStatus :TripValidationRequestEnum;
    RequestStatusName :string;
    ValidationTime:Date;
    ValidationNote:string;
    Note:string;
    SpentTime:number;
    ExcelantMaxTime:number;
    GoodMaxTime:number;
    LateMaxTime:number;
    IsSelected: boolean;
    IsDeleting: boolean;
    TripRateOption: TripRateOption;
    PlannedCompleteTimeInt: number;
    PlannedCompleteTime: Date;
    ExpectedRateName:string;
    ExpectedRateColor:string;
    IsPaused :boolean;
    StatusColor:string;
    TripCode:string
}