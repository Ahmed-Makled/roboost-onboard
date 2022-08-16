import { OrderLogViewModel } from './order-log.model';
import { OrderItemViewModel } from './order-item.model';

import { CustomerReviewViewModel } from './cutomer-review.model';
import { TripOrderViewModel } from './trip.model';
import { CustomerOrderViewModel } from './cutomer.model';
import { DistanceStatus } from 'src/app/enum/distance-status';
import { OrderRateOption } from 'src/app/enum/order-rate-option';
import { OrderStatus } from 'src/app/enum/order-status.enum';
import { DeliveryTimeStatus } from 'src/app/enum/delivery-time-status';

export class OrderDetailsViewModel {

    ID: number;
    OrderNumber: string;
    TripNumber: number;
    Code: string
    DeliverymanName: string;
    DeliverymanMobile: string;
    DeliverymanStars: number;
    DeliverymanID: number;
    CityName: string;
    PlannedLatitude: number;
    PlannedLongitude: number;
    Latitude: number;
    Longitude: number;
    Attempts: number;
    PreperationTime: Date
    DeliveryTime?: Date
    SetLocationTime: Date
    Status: OrderStatus
    StatusName: string;
    ServingTime: number;
    Weight: number
    IsActive: boolean
    IsTopPriority: boolean
    OrderLogs: OrderLogViewModel[];
    OrderTrackcingLogs: OrderLogViewModel[];
    
    OrderItems: OrderItemViewModel[];
    Amount: number;
    Date: Date;
    CustomerName: string;
    CustomerMobile: string;
    CustomerID: number;
    Address: string;
    Performance: string;
    Rate: OrderRateOption
    TripID: number;
    OrderDeliverTime: number
    PlannedDistance: number
    Distance: number
    DeliverymanImage: string;
    BranchLongitude: number;
    BranchLatitude: number;
    DeliveryTimeStatus: DeliveryTimeStatus
    DistanceStatus: DistanceStatus
    DeliveryTimeStatusName: string
    DistanceStatusName: string
    TotalPrice: number;
    BranchName: string;
    CustomerReview: CustomerReviewViewModel;
    IsAddressVerified: boolean
    PreparedBy?: number
    PreparedByName: string
    PreperationDuration: number
    Trip: TripOrderViewModel
    Customer: CustomerOrderViewModel = new CustomerOrderViewModel();


   CreatedDate: Date;

}