import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { EditRoleViewModel } from './view-models/user-role.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private _apiService: ApiService) { }

  getMainInfo(id: number) {
    return this._apiService.get(`/User/GetMainInfo?id=${id}`);
  }

  resetPassword(UserID: number, password: string) {
    return this._apiService.update(`/User/ResetePassword`, { UserID, password })
  }

  editRole(body: EditRoleViewModel) {
    return this._apiService.update(`/User/UpdateRole`, body);
  }

}
