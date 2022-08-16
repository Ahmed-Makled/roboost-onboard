import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';
import { BranchHomeSearchViewModel } from '../home/view-models/branch-home-search.model';
import { BranchPerformanceSearchViewModel } from './view-models/branch-performance-search.model';

@Injectable({
  providedIn: 'root',
})
export class BranchPerformanceService {
  controller: string = "Branch";
  constructor(private _apiService: ApiService) { }

  get(searchViewModel:BranchHomeSearchViewModel,orderBy:string, isAscending:boolean, pageIndex:number, pageSize:number=0){
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.FromDate) {
      params = params.set("FromDate", searchViewModel.FromDate);
    }
    if (searchViewModel.ToDate) {
      params = params.set("ToDate", searchViewModel.ToDate);
    }
    if (searchViewModel.AreaID) {
      params = params.set("areaID", searchViewModel.AreaID.toString());
    }
    return this._apiService.get(`/${this.controller}/GetBranchPerformance?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,params);
  }

  getReport(searchViewModel:BranchPerformanceSearchViewModel,orderBy:string, isAscending:boolean){
    //alert(orderBy);
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
      if(searchViewModel.AreaID)
      {
        params=params.set("areaID",searchViewModel.AreaID.toString());
      }
    return this._apiService.getFiles(`/${this.controller}/GetPerformanceReport?orderBy=${orderBy}&isAscending=${isAscending}`,params);
  }
}
