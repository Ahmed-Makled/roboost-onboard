import { ApplicationRole } from "src/app/enum/application-role";
export class UserHomeViewModel {
    ID: number;
    Name: string;
    Email: string;
    Mobile: string;
    Image: string
    IsActive: boolean
    Roles: UserRoleViewModel[] = []
    AllowMultipleDevices:boolean;
}
export class UserRoleViewModel {
    RoleName: string
    RoleID: ApplicationRole
}