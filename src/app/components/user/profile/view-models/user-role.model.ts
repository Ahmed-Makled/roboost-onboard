import { ApplicationRole } from "src/app/enum/application-role"

export class UserRoleViewModel {
    RoleName :string
    RoleID :ApplicationRole
}
export class EditRoleViewModel {
  BranchesIDs:number[]
  RoleID: number
  UserID: number
}
