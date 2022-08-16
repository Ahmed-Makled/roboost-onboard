export class TripByDeliveryServiceViewModel {
    Date: Date
    Total: number;
    DeliverymanID: number;
    DeliverymanName:string;
    BranchName:string
    ExcellentTrips: number;
    ExcellentDeliveryService: number;
    ExcellentTripsDeliveryServiceAmount: number;
    GoodTrips: number;
    GoodDeliveryService: number;
    GoodTripsDeliveryServiceAmount: number;
    LateTrips: number;
    LateDeliveryService: number;
    LateTripsDeliveryServiceAmount: number;
    TooLateTrips: number;
    TooLateDeliveryService: number;
    TooLateTripsDeliveryServiceAmount: number;
    ExcellentTripsPercentage: number;
    GoodTripsPercentage: number;
    LateTripsPercentage: number;
    TooLatePercentage: number;
}