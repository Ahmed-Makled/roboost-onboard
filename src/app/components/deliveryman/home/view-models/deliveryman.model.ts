import { DeliveryStatus } from 'src/app/enum/delivery-status';

export class DeliverymanViewModel {
  ID: number;
  Code: string;
  Name: string;
  EnrollID: string;
  HubName: string;
  BranchID:number
  Email: string;
  Mobile: string;
  StatusName: string;
  StatusID: DeliveryStatus;
  IsActive: boolean;
  IsSelected: boolean;
  IsDeleting: boolean;
  LastOrder: Date;
  CreatedDate: Date;
  IsLoggedIn: Boolean;
  StatusColor: string;
  QueueNo: Number;
  Image: string;
  lastActivity: Date;
  Stars: number;
  ColorStatus: string;
  Ranking: number;
  Wallet: number;
  BreakSpentTime: number;
  AppVersionNumber: string;
  DeviceTypeName: string;
  DeviceType: number;
  IsSaving:boolean=false
}
