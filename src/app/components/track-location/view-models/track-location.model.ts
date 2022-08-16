
export class TrackLocationViewModel {

    DeliverymanID: number
    DeliverymanName: string
    DeliverymanImage: string
    DeliverymanMobile :string
    StatusName: string
    RateStatus: number
    RateStatusName:string
    Code: string
    Number: number
    PlannedCompleteTime: Date
    PlannedCompleteTimeInt :number
    PlannedDuration: number 
  
    // Locations:LocationViewModel[]=[]
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
    DeliverymanStars:number;
    Accuracy
}