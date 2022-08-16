import { ApplicationRole } from "src/app/enum/application-role";
import { LanguageTypeEnum } from "../../logged-user/view-model/logged-user.model";

export class LogInViewModel{
  Troken :string ;
  IsSingleStore :boolean;
  Role:ApplicationRole[]=[]
  Language:LanguageTypeEnum
  IsAllowMultiBranch:boolean 
  AllowedPages:string
  RedirectUrl:string
}