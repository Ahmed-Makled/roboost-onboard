import { DeliveryStatus } from "src/app/enum/delivery-status";
import { DeliveryTimeStatus } from "src/app/enum/delivery-time-status";
import { OrderRateOption } from "src/app/enum/order-rate-option";
import { OrderStatus } from "src/app/enum/order-status.enum";
import { TripRateOption } from "src/app/enum/trip-rate-option";
import { TripStatus } from "src/app/enum/trip-status";
import { ServiceItemViewModel } from "./order-create.model";

export class DispatchTripViewModel {
  ID: number
  Number: number
  DeliverymanID: number
  DeliverymanName: string
  DeliverymanImage: string
  Status: TripStatus
  StatusName: string
  StartTime: Date
  CloseTime: Date
  CreatedDate: Date
  SpentTime: number = 0;
  ExcelantMaxTime: number;
  GoodMaxTime: number;
  LateMaxTime: number;
  OrdersCount: number;
  Amount: number;
  IsSelected: boolean;
  IsDeleting: boolean;
  TripRateOption: TripRateOption;
  RateStatusName: string;
  RateStatus: number;
  PlannedCompleteTimeInt: number;
  PlannedCompleteTime: Date;
  ExpectedRateName: string;
  ExpectedRateColor: string;
  IsPaused: boolean;
  Duration: number;
  StatusColor: string;
  IsSpecialTrip: boolean;
  BranchName: string
  BranchID: number
  AreaID: number
  IsRealTime: boolean = false
  PlannedDistance: number
  ArrivalTime?: Date
  PickupTime?: Date
  ArrivalTimeSecond?: number
  Code: string;
  Orders: DispatchOrderViewModel[] = []
  showTripLog: boolean = false;
  showTracking: boolean = false;
}

export class DispatchOrderViewModel {
  ID: number;
  TripID: number;
  Code: string;
  OrderNumber: string;
  Name: string;
  Address: string;
  Mobile: string;
  ServicesCount: number;
  PlannedDistance: number;
  PlannedDeliveryTime: Date;
  CreatedDate: Date;
  RemainingTime: number;
  DeliveryTimeStatusName: string;
  DeliveryTimeStatus: DeliveryTimeStatus;
  DistanceStatusName: string;
  Duration: number;
  ServingTime: number;
  Priority?: number;
  Amount: number = 0;
  Date: Date = new Date();
  Status: OrderStatus = OrderStatus.READY;
  StatusName: string
  PlannedLongitude: number;
  PlannedLatitude: number;
  HasGoogleLocation: boolean;
  IsTopPriority: boolean
  IsPaused: boolean
  HasTimer: boolean;
  isSelected: boolean;
  Distance: number = 0;
  SpentTime: number = 0;
  RateName: string;
  Rate: OrderRateOption;
  Note: string;
  OrderDeliveryTime: number
  CustomerID: number
  Longitude: number = 31.2222222222
  Latitude: number = 31.2222222222
  BranchName: string;
  BranchID: number;
  AreaID: number;
  IsRealTime: boolean = false;
  IsServiceOpened: boolean = false
  IsTransite: boolean = false;
  District: string;
  SyncedTime: any;
  ShowPrint: boolean
  ShowOrderLocation: boolean = false
  ShowTaskLog: boolean = false;
  ShowTaskDetails: boolean = false;
  IsAction: boolean = true
  IsStoreSelect: boolean = false
  IsAgentSelect: boolean = false
  Services: DispatchOrderSkillViewModel[] = [];
  DeliveryVerificationCode: String;
  SalesVATAmount: number;
  Discount: number;
  DiscountPercentage: number;
  TotalAmount: number;
  SubAmount: number;
  SalesVAT: number;
  DeliveryFees: number;
  TaxAmount: number;
  Items: DispatchOrderItemViewModel[] = []
}

export class DispatchAgentViewModel {
  ID: number;
  Name: string;
  StatusName: string;
  StatusID: DeliveryStatus;
  StatusColor: string;
  Image: string
  IsRealTime: boolean;
  BranchID: number;
  Longitude: number = 26.8357675;
  Latitude: number = 30.7956597;
  BranchName: string;
  AreaID: number;
  Selected: boolean = true
}

export class DispatchOrderSkillViewModel {
  ServiceID: number
  Name: string;
  Image: string;
  OrderID: number;
}
export class DispatchOrderItemViewModel {
  ProductID: string
  ProductName: string
  UnitPrice: number
  Quantity: number
  Stock: number
  ImageURL: string
  Note: string
}
export class DispatchSelectItemViewModel {
  ID?: number
  Name: string;
  Code?: string;
  Selected: boolean;
  Longitude?: number
  Latitude?: number
  NumberOfAgents?: number
  NumberOfTasks?: number
  NumberOfTrips?: number
}
