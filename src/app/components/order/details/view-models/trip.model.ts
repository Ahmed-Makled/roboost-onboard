import { TripRateOption } from "src/app/enum/trip-rate-option"

export class TripOrderViewModel {
      ID: number
      OrderCount: number
      Number: number
      Code:string
      Distance: number
      ExpectedDeliveredTime: Date
      RateStatus: TripRateOption
      RateStatusName: string
      TotalDeliveryTime: number
      CreatedDate: Date
      SpentTime :number;
      BranchLongitude:number;
      BranchLatitude:number;
}