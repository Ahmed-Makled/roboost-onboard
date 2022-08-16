import { DeliveryStatus } from "src/app/enum/delivery-status"

export class PersonalInformationViewModel{
    ID :number
    Name :string
    Mobile :string
    NationalID :string
    EnrollID:number
    StatusID :DeliveryStatus
    StatusName :string
    UserName:string
    Color :string
    QueueNo :number
    IsLoggedIn :boolean
    ServicesID :number[]=[]
}