
import { OrderStatus } from "src/app/enum/order-status.enum";

export class OrderLogViewModel {
    ID:number;
    StatusName:string;
    Status:OrderStatus;
    OrderStatusPosition:number;
    Action
    ActionName:string
    Note:string;
    CreatedDate:Date;
    Icon:string;
    Color:string;



}