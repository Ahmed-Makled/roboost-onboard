
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/service/api.service';
import { BranchAreaPerformanceSearchViewModel } from './view-models/area-performance-search.model';


@Injectable({
  providedIn: 'root'
})
export class BranchAreaPerformanceService {

  controller : string = "Area";
  constructor(private _apiService:ApiService) { }
  
  get(searchViewModel:BranchAreaPerformanceSearchViewModel,orderBy:string, isAscending:boolean, pageIndex:number, pageSize:number=0){
    //alert(orderBy);
    if(pageSize==0)
      pageSize=environment.pageSize;
     let params = new HttpParams();
      if(searchViewModel.ID)
      {
        params=params.set("ID",searchViewModel.ID.toString());
      }
      if(searchViewModel.NameArabic)
      {
        params=params.set("NameArabic",searchViewModel.NameArabic.toString());
      }
      if(searchViewModel.FromDate)
      {
        params=params.set("FromDate",searchViewModel.FromDate);
      }
      if(searchViewModel.ToDate)
      {
        params=params.set("ToDate",searchViewModel.ToDate);
      }
    return this._apiService.get(`/${this.controller}/GetAreaPerformance?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,params);
  }
}
