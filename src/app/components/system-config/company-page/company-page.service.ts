import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { CompanyPageCreateViewModel } from './view-models/company-page-create.model';

@Injectable({
  providedIn: 'root'
})

export class CompanyPageService {

  constructor(private apiService:ApiService) { }
  
  get(){
    return this.apiService.get(`/Page/GetList`)
  }
  
  getEditableByID(id:number){
    return this.apiService.get(`/CompanyPage/Get?companyID=${id}`)
  }

  save(data:CompanyPageCreateViewModel){
    return this.apiService.post(`/CompanyPage/Save`,data)
  }

}
