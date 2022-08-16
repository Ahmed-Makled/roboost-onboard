import { TripStatus } from "src/app/enum/trip-status";
import { TripValidationRequestEnum } from "./validation-request.enum";

export class TripValidationRequestSearchViewModel {
    ID?: number;
    BranchID?: number;
    Status?: TripStatus;
    tripID: number;
    number?: Number;
    RequestStatus?: TripValidationRequestEnum
    deliverymanID?: number;
    FromDate: any = new Date();
    ToDate: any = new Date();
    Performance?: number
    supervisorID: number;
}