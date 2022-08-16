import { TripRateOption } from "src/app/enum/trip-rate-option"

export class TripCreateViewModel {
    ID: number
    Numer: number
    DeliverymanID: number
    DeliverymanName: string
    StatusID: number
    CreatedDate: Date
    Orders: number
    Amount: number

}

export class TripRateEditViewModel {
    TripID: number
    Rate: TripRateOption
    Note: string
    ReasonID: number
}