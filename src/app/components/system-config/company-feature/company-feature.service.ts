import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { CompanyFeatureCreateViewModel } from './view-models/company-feature-create.model';
import { CompanyFeatureSearchViewModel } from './view-models/company-feature.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyFeatureService {
  constructor(private apiService:ApiService) { }
  
  get(){
    return this.apiService.get(`/Feature/GetFeatureModuleList`)
  }
  
  getEditableByID(id:number){
    return this.apiService.get(`/CompanyFeature/GetFeatureModuleList?companyID=${id}`)
  }

  save(data:CompanyFeatureCreateViewModel){
    return this.apiService.post(`/CompanyFeature/Save`,data)
  }
 

}
