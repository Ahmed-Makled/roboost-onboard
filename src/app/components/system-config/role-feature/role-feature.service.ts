import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { RoleFeatureCreateViewModel } from './view-models/role-feature-create.model';

@Injectable({
  providedIn: 'root'
})
export class RoleFeatureService {
  constructor(private apiService:ApiService) { }
  
  get(){
    // return this.apiService.get(`/CompanyRoleFeature/Get`)
    return this.apiService.get(`/CompanyFeature/GetFeatureModuleList`)
  }
  
  getEditableByID(id:number){
    return this.apiService.get(`/CompanyRoleFeature/GetByRole?roleID=${id}`)
  }

  save(data:RoleFeatureCreateViewModel){
    return this.apiService.post(`/CompanyRoleFeature/Save`,data)
  }
 

}
