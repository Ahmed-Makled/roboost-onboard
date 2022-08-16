import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';
import { BranchHomeCreateViewModel } from './view-models/branch-home-create.model';
import { BranchHomeSearchViewModel } from './view-models/branch-home-search.model';
import { StoreCopyViewModel } from './view-models/branch-home.model';

@Injectable({
  providedIn: 'root',
})
export class BranchHomeService {
  controller: string = "Branch";
  constructor(private _apiService: ApiService) { }
  get(searchViewModel: BranchHomeSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.ID) {
      params = params.set("ID", searchViewModel.ID.toString());
    }
    if (searchViewModel.NameArabic) {
      params = params.set("NameArabic", searchViewModel.NameArabic.toString());
    }
    if (searchViewModel.NameEnglish) {
      params = params.set("NameEnglish", searchViewModel.NameEnglish.toString());
    }
    if (searchViewModel.FromDate) {
      params = params.set("FromDate", searchViewModel.FromDate);
    }
    if (searchViewModel.ToDate) {
      params = params.set("ToDate", searchViewModel.ToDate);
    }
    return this._apiService.get(`/${this.controller}/get?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }

  postOrUpdate(body: BranchHomeCreateViewModel) {
    if (body.ID == 0) 
      return this._apiService.post(`/${this.controller}/Post`, body);
    else
      return this._apiService.update(`/${this.controller}/Put`, body);
  }
  getbyID(id) {
    return this._apiService.get(`/${this.controller}/GetByID?id=${id}`);

  }
  remove(id: number) {
    return this._apiService.remove(`/${this.controller}/Delete?id=${id}`)
  }
  copy(body: StoreCopyViewModel) {
    return this._apiService.post(`/${this.controller}/CopyBranch`, body);
  }


 
}
