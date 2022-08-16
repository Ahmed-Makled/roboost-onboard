
export class UserInfoCreateViewModel {
  ID: number ;
  CompanyID?: number
  Name: string
  Email: string = "";
  UserName:string;
  Password:string;
  Mobile: number
  RoleID?:number
}

// export class UserCreateViewModel {
//   User: UserInfoCreateViewModel = new UserInfoCreateViewModel;
//   BranchID: number
//   BranchesID:number[]=[]
// }

export class UserCreateViewModel {
  ID: number ;
  CompanyID?: number
  Name: string
  Email: string = "";
  UserName:string;
  Password:string;
  Mobile: number;
  RoleID?:number;
  BranchesID:number[]=[]
}


export class DeliverymanCreateViewModel 
{
    User:UserInfoCreateViewModel = new UserInfoCreateViewModel;
    BranchID :number =0
    Name :string
    Mobile :string
    NationalID :string
   ServicesID :number[]=[]
}
