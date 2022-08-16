import { DeliveryStatus } from "src/app/enum/delivery-status"

export class PersonalInformationViewModel{
    ID :number
    Mobile :string
    EnrollID:string
    NationalID :string
    StatusID :DeliveryStatus
    StatusName :string
    UserName:string
    Color :string
    QueueNo :number
    IsLoggedIn :boolean
}