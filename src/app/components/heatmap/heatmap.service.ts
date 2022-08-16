import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { HeatMapSearchViewModel } from './view-models/heat-map-search.model';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class HeatmapService {

  
  constructor(private _apiService:ApiService) { }
  
  getHeatmapData(searchViewModel:HeatMapSearchViewModel,pageIndex:number){
    let params = new HttpParams();
      if(searchViewModel.AmountFrom)
        params=params.set("amountFrom",searchViewModel.AmountFrom.toString());
      if(searchViewModel.AmountTo)
        params=params.set("amountTo",searchViewModel.AmountTo.toString());
      if(searchViewModel.AreaID)
        params=params.set("areaID",searchViewModel.AreaID.toString());
      if(searchViewModel.BranchID)
        params=params.set("branchID",searchViewModel.BranchID.toString());
      if(searchViewModel.ToDate)
        params=params.set("DateTo",searchViewModel.ToDate.toString());
      if(searchViewModel.FromDate)
       params=params.set("DateFrom",searchViewModel.FromDate.toString());

      return this._apiService.get(`/ShippingAddress/GetHeatmapData?pageIndex=${pageIndex}`,params)
  }
  getBranchesLocation(searchViewModel:HeatMapSearchViewModel){
    let params = new HttpParams();
    if(searchViewModel.AreaID)
      params=params.set("areaID",searchViewModel.AreaID.toString());
      if(searchViewModel.BranchID)
      params=params.set("branchID",searchViewModel.BranchID.toString());
    return this._apiService.get(`/Branch/GetBranchesLocation`,params)
  }
 
}
