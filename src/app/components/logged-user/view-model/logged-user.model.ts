export class UserPagesViewModel {
  ID: number;
  ModuleID: number;
  ParentPageID: number;
  NameArabic: string;
  NameEnglish: string;
  ModuleName: string;
  DisplayOrder: number;
  Icon: string;
  Url: string;
  IsActive: boolean;
  ShowInMenu: boolean
  IsImage: boolean
}

export class UserFeatureViewModel {
  ID: number;
  IsActive: boolean;
  Name: string;
  ModuleID: number;
  ModuleName: string;
  Selected: boolean = false;
}

export enum LanguageTypeEnum {
  AR = 0,
  EN = 1,
}


export enum ModuleEnum {
  TASK = 1,
  TRIP = 2,
  AGENT = 3,
  STORE = 4,
  USER = 5,
  ITEM = 6,
  // CONFIGURATION = 6,
  COMPANY = 7,
  CUSTOMER = 8,
}
