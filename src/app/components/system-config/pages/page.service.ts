import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';
import { PageCreateViewModel } from './view-models/page-create.model';
import { PageSearchViewModel } from './view-models/page-search.model';

@Injectable({
  providedIn: 'root',
})
export class PagesService {
  controller: string = "Page"
  constructor(private _apiService: ApiService) { }
  get(searchViewModel: PageSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
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

  postOrUpdate(body: PageCreateViewModel, isEdit: boolean) {
    if (!isEdit) {
      return this._apiService.post(`/${this.controller}/Add`, body);
    }
    else return this._apiService.update(`/${this.controller}/Update`, body);
  }
  getbyID(id) {
    return this._apiService.get(`/${this.controller}/GetEditableByID?id=${id}`);
  }
  remove(id: number) {
    return this._apiService.update(`/${this.controller}/Delete?PageID=${id}`);
  }
  getByAreaID(areaId: number) {
    return this._apiService.get(`/${this.controller}/GetByAreaID?areaID=${areaId}`);
  }
}
