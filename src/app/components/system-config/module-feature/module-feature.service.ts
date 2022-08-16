import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { ModuleFeatureCreateViewModel } from './view-models/module-feature-create.model';

@Injectable({
  providedIn: 'root'
})
export class ModuleFeatureService {
  constructor(private apiService:ApiService) { }
  
  get(){
    return this.apiService.get(`/CompanyModuleFeature/Get`)
  }
  
  getEditableByID(id:number){
    return this.apiService.get(`/CompanyModuleFeature/GetByModule?roleID=${id}`)
  }

  save(data:ModuleFeatureCreateViewModel){
    return this.apiService.update(`/Feature/UpdateModule?featureID=${data.FeatureID}&ModuleID=${data.ModuleID}`)
  }
 

}
