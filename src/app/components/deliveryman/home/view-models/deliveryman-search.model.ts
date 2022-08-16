export class DeliverymanSearchViewModel {
  ID?: number;
  Name?: string;
  EnrollID?: string;
  Email?: string;
  Mobile?: string;
  IsActive?: boolean;
  IsArchive?: boolean;
  IsloggedIn?: number;
  FromDate: any = new Date();
  ToDate: any = new Date();
  Status: number;
  branchID?: number;
  CompanyID?: number;
  DeviceType: number;
  AppVersionNumber?: string;

}
