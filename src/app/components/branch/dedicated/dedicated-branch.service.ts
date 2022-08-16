import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { DedicatedBranchEditViewModel } from './view-models/deliveryman-branch-edit.model';

@Injectable({
  providedIn: 'root',
})
export class DedicatedBranchService {
  constructor(private _apiService: ApiService) { }

  update(model: DedicatedBranchEditViewModel) {
    return this._apiService.update(`/DeliverymanBranch/Update`, model);
  }
  get() {
    return this._apiService.get(`/DeliverymanBranch/Get`);
  }

}
