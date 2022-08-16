import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';
import { CustomerReviewSearchViewModel } from './view-models/customer-review-search.model';
@Injectable({
  providedIn: 'root'
})
export class CustomerReviewService {
  constructor(private _apiService:ApiService) { }
  getCustomerReview(searchViewModel:CustomerReviewSearchViewModel,orderBy:string, isAscending:boolean, pageIndex:number, pageSize:number=0){
    if(pageSize==0)
      pageSize=environment.pageSize;
      let params = new HttpParams();
      if(searchViewModel.branchID)
      {
        params=params.set("branchID",searchViewModel.branchID.toString());
      }
      if(searchViewModel.deliverymanID)
      {
        params=params.set("deliverymanID",searchViewModel.deliverymanID.toString());
      }
      if(searchViewModel.orderNumber)
      {
        params=params.set("orderNumber",searchViewModel.orderNumber.toString());
      }
      if(searchViewModel.deliverymanRating)
      {
        params=params.set("deliverymanRating",searchViewModel.deliverymanRating.toString());
      }
      if(searchViewModel.hasFeedback)
      {
        params=params.set("hasFeedback",searchViewModel.hasFeedback.toString());
      }
      if(searchViewModel.serviceRating)
      {
        params=params.set("serviceRating",searchViewModel.serviceRating.toString());
      }
      if(searchViewModel.FromDate)
      {
        params=params.set("FromDate",searchViewModel.FromDate.toString());
      }
      if(searchViewModel.ToDate)
      {
        params=params.set("ToDate",searchViewModel.ToDate.toString());
      }
    return this._apiService.get(`/customerReview/get?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,params);
  }
}
