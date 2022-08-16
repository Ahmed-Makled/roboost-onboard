import { TripValidationRequestStatus } from "src/app/enum/trip-validation-request-status.enum";

export class TripValidationRequestViewModel
{
    ID:number;
    Status  :TripValidationRequestStatus;
    StatusName:string;
    ValidationTime:Date;
    ValidationNote:string;
    Note:string
}