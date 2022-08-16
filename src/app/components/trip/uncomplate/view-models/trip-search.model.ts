export class TripSearchViewModel {
    ID?: number;
    Status?: number;
    Number?: Number;
    DeliverymanID?: number;
    EnrollID?: string;
    BranchID?: number;
    FromDate: any = new Date();
    ToDate: any = new Date();
    Performance?: number
    IsSpecialTrip?: boolean
    Transfer:string;
}