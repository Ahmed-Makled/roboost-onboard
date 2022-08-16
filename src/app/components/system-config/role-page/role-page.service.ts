import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { RolePageCreateViewModel } from './view-models/role-page-create.model';

@Injectable({
  providedIn: 'root'
})
export class RolePageService {

  constructor(private apiService:ApiService) { }
  
  get(){
    return this.apiService.get(`/CompanyPage/Get`)
  }
  
  getEditableByID(id:number){
    return this.apiService.get(`/CompanyRolePage/GetByRole?roleID=${id}`)
  }

  save(data:RolePageCreateViewModel){
    return this.apiService.post(`/CompanyRolePage/Save`,data)
  }

}
