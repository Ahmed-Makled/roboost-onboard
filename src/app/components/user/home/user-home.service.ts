import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationRole } from 'src/app/enum/application-role';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';
import { UserCreateViewModel } from './view-models/user-home-create.model';
import { UserHomeSearchViewModel } from './view-models/user-home-search.model';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  controller: string = 'User';
  constructor(private _apiService: ApiService) { }
  get(searchViewModel: UserHomeSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0
  ) {
    if (pageSize == 0) pageSize = environment.pageSize;
    let params = new HttpParams();

    if (searchViewModel.branchID) {
      params = params.set("branchID", searchViewModel.branchID.toString());
    }
    if (searchViewModel.roleID) {
      params = params.set("role", searchViewModel.roleID.toString());
    } 
    return this._apiService.get(`/${this.controller}/Get?`, params);
    // return this._apiService.get(`/${this.controller}/get?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,params);

  }

  delete(userID: number) {
    return this._apiService.remove(`/${this.controller}/Delete?userID=${userID}`,)
  }

  activate(UserID: number) {
    return this._apiService.update(`/${this.controller}/Activate`, UserID)
  }
  deactivate(UserID: number) {
    return this._apiService.update(`/${this.controller}/Deactivate`, UserID)
  }
  upgradeToManager(userID) {
    return this._apiService.update(`/${this.controller}/UpgradeToManager?userID=${userID}`)
  }


  getValidUserRole(role: ApplicationRole) {
    return this._apiService.get(`/Shared/GetValidUserRole?role=${role}`);
  }
  createUser(viewModel: UserCreateViewModel) {
    return this._apiService.post(`/${this.controller}/Add`, viewModel);
  }

  switchAllowMultipleDevices(ID :number){
    return this._apiService.update(`/${this.controller}/SwitchAllowMultipleDevices?userID=${ID}`)
  }
  forceLogout(ID :number){
    return this._apiService.update(`/${this.controller}/ForceLogout?userID=${ID}`)
  }
}

