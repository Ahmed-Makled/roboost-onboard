import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';
import { BroadcastSearchViewModel } from './home/view-models/broadcast-model';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {

  controller: string = "Broadcast";
  constructor(private _apiService: ApiService) { }

  get(searchViewModel=new BroadcastSearchViewModel,orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    // return this._apiService.get(`/${this.controller}/get?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
    return this._apiService.get(`/${this.controller}/get?pageSize=${pageSize}`, params);
  }

  remove(code:string) {
    return this._apiService.update(`/${this.controller}/Delete?code=${code}`);
  }
  update(code:string ) {
      return this._apiService.update(`/${this.controller}/ChangeActiveStatus?code=${code}`);
  }

  getDetailsMainInfo(code:string) {
    return this._apiService.get(`/${this.controller}/GetDetailsMainInfo?code=${code}`);
  }
  getDetailsAgents(code:string)  {
    return this._apiService.get(`/${this.controller}/GetDetailsAgents?code=${code}`);
  }

}
