import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/service/api.service';
import { BranchAreaSearchViewModel } from './view-models/branch-area-search.model';
import { BranchAreaCreateViewModel } from './view-models/branch-area-create.model';
@Injectable({
  providedIn: 'root'
})
export class BranchAreaService {
  controller: string = "Area";
  constructor(private _apiService: ApiService) { }
  get(viewModel: BranchAreaSearchViewModel) {
    let params = new HttpParams();
    if (viewModel.branchID) {
      params = params.set("branchID", viewModel.branchID.toString());
    }
    if (viewModel.Name) {
      params = params.set("name", viewModel.Name);
    }
    return this._apiService.get(`/${this.controller}/get`, params);
  }
  remove(id: number) {
    return this._apiService.remove(`/${this.controller}/Delete?id=${id}`);
  }
  postOrUpdate(model: BranchAreaCreateViewModel) {
    if (model.ID == 0)
      return this._apiService.post(`/${this.controller}/Post`, model);
    else return this._apiService.update(`/${this.controller}/Put`, model);
  }
  create(model: BranchAreaCreateViewModel) {
    return this._apiService.post(`/${this.controller}/Post`, model);
  }
  getbyID(id: number) {
    return this._apiService.get(`/${this.controller}/GetByID?id=${id}`);
  }

}