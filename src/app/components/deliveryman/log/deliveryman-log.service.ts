
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { DeliverymanLogSearchViewModel } from './view-models/deliveryman-log-search.model';
import { ApiService } from 'src/app/service/api.service';


@Injectable({
  providedIn: 'root'
})
export class DeliverymanLogService {
  controller: string = "owner/DeliverymanLog";
  constructor(private apiService: ApiService) { }

  get(searchViewModel: DeliverymanLogSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.ID) {
      params = params.set("id", searchViewModel.ID.toString());
    }
    if (searchViewModel.DeliverymanID) {
      params = params.set("deliverymanID", searchViewModel.DeliverymanID.toString());
    }
    if (searchViewModel.Action) {
      params = params.set("action", searchViewModel.Action.toString());
    }
    if (searchViewModel.FromDate) {
      params = params.set("fromDate", searchViewModel.FromDate);
    }
    if (searchViewModel.ToDate) {
      params = params.set("toDate", searchViewModel.ToDate);
    }
    return this.apiService.get(`/${this.controller}/get?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }

  getStatusList() {
    return this.apiService.get(`/${this.controller}/GetStatusList`)
  }
  getDeliverymanLogDetails(id) {
    return this.apiService.get(`/${this.controller}/GetDeliverymanLogDetails?deliverymanID=${id}`)
  }
}
