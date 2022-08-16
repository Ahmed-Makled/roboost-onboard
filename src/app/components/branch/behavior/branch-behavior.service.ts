import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { BranchBehaviorSearchViewModel } from './view-models/branch-behavior-search.model';
import { ApiService } from 'src/app/service/api.service';
@Injectable({
  providedIn: 'root'
})
export class BranchBehaviorService {
  controller: string = "Branch";
  constructor(private _apiService: ApiService) { }
  get(searchViewModel: BranchBehaviorSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.ID) {
      params = params.set("ID", searchViewModel.ID.toString());
    }
    if (searchViewModel.NameArabic) {
      params = params.set("NameArabic", searchViewModel.NameArabic.toString());
    }
    if (searchViewModel.FromDate) {
      params = params.set("FromDate", searchViewModel.FromDate);
    }
    if (searchViewModel.ToDate) {
      params = params.set("ToDate", searchViewModel.ToDate);
    }
    return this._apiService.get(`/${this.controller}/GetBranchBehavior?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  getbyID(id) {
    return this._apiService.get(`/${this.controller}/GetByID?id=${id}`);
  }
  remove(id: number) {
    return this._apiService.remove(`/${this.controller}/Delete?id=${id}`)
  }
}
