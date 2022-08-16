import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { LanguageTypeEnum, ModuleEnum } from './view-model/logged-user.model';

@Injectable({
  providedIn: 'root'
})

export class LoggedUserService {

  constructor(private _apiService: ApiService) { }

  getUserPages() {
    return this._apiService.get(`/CompanyRolePage/GetUserPages`);
  }
  getUserModuleFeature(body:ModuleEnum[]) {
    return this._apiService.update(`/CompanyRoleFeature/GetUserModuleFeature`,body);
  }
  hasFeature(id:number) {
    return this._apiService.get(`/CompanyRoleFeature/HasFeature?FeatureID=${id}`);
  }
  updateLanguage(lang:LanguageTypeEnum) {
    return this._apiService.update(`/User/UpdateLanguage`,{Language:lang});
  }

}
