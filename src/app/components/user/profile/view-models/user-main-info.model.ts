import { from } from "rxjs"
import { SelectItem } from "src/app/model/shared/select-view-model"
import {UserRoleViewModel} from './user-role.model'
export class UserMainInfoViewModel {
    ID: number
    Name: string
    Email: string
    Mobile: string
    UserName: string
    ProfilePicture: string
    RoleID: number
    RoleName: string
    Branches:  SelectItem[]
    Roles:UserRoleViewModel[]=[]
}

export class EditPasswordViewModel {
    CurrentPassword :string
     NewPassword :string
     NewPasswordConfirmation :string
 }