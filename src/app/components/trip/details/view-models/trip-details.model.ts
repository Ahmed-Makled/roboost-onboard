import { TripOrderViewModel } from './trip-order.model';
import { TripLogViewModel } from './trip-log.model';
import { TripValidationRequestViewModel } from './trip-validation-request.model';
import { TripStatus } from 'src/app/enum/trip-status';

export class TripDetailsViewModel {
    ID: number
    DeliverymanName: string
    DeliverymanImage: string
    DeliverymanMobile :string
    StatusName: string
     Status :TripStatus;
    RateStatus: number
    RateStatusName:string
    Code: string
    Number: number
    PlannedCompleteTime: Date
    PlannedCompleteTimeInt :number
    PlannedDuration: number
    PlannedDistance: number
    Distance: number
    Duration: number
    Stars: number
    ServingTime: number
    IsSpecialTrip: boolean
    AutoStartTime: Date
    CompleteTime: Date
    CreatedDate :Date
    SpentTime:number;
    CloseTime: Date
    StartTime: Date
    ConfirmTime: Date
    Rate: number
    TotalDeliveredTime:number;
    BranchLongitude :number;
    BranchLatitude :number;
    ExpectedDeliveredTime :number;
    StatusColor:string;
    StartPosition:number ;
    CretedPosition:number ;
    CompletedPosition:number ;
    Orders: TripOrderViewModel[];
    TripLogs: TripLogViewModel[];
    TripTrackingLogs: TripLogViewModel[];
    DeliverymanStars:number;
    BranchName:string;
    PerformanceColor:string;
    HasValidationRequest:boolean;
    TripValidationRequest:TripValidationRequestViewModel
    TrackingLocations: TrackingLocationViewMode[]=[]
    AccurateTrackingLocations :TrackingLocationViewMode[]=[]
    DeliveryTime?: Date;
}
export class TrackingLocationViewMode{
    Latitude :number = 0;
    Longitude :number = 0;
    Date :Date
    Accuracy :number
}