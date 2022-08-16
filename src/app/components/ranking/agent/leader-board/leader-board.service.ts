import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { DeliverymanRankSearchViewModel } from './view-models/deliveryman-rank-search.model';

@Injectable({
  providedIn: 'root'
})
export class LeaderBoardService {
  
  controller : string = "leaderBoard";
  constructor(private apiService:ApiService) { }
  
  getMonthlyRanking(searchViewModel :DeliverymanRankSearchViewModel){
    let params = new HttpParams();
    if(searchViewModel.BranchID)
    {
      params=params.set("branchID",searchViewModel.BranchID.toString());
    }
    if(searchViewModel.AreaID)
    {
      params=params.set("areaID",searchViewModel.AreaID.toString());
    }
    if(searchViewModel.Date)
    {
      params=params.set("date",searchViewModel.Date.toString());
    }

    params=params.set("days",(2).toString());
    
    return this.apiService.get(`/${this.controller}/GetDeliverymanRank`,params);
  }
}
