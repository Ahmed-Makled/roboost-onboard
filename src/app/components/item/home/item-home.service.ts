import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ItemSearchViewModel } from './view-models/item-search.model';
import { ItemViewModel } from './view-models/item.model';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class ItemHomeService {
  controller : string = "Item";
  constructor(private _apiService:ApiService) { }
  

  get(searchViewModel:ItemSearchViewModel,orderBy:string, isAscending:boolean, pageIndex:number, pageSize:number=0){
     if(pageSize==0)
       pageSize=environment.pageSize;
       let params = new HttpParams();
       if(searchViewModel.ID)
       {
         params=params.set("ID",searchViewModel.ID.toString());
       }
       if(searchViewModel.Name)
       {
         params=params.set("Name",searchViewModel.Name.toString());
       }
       if(searchViewModel.IsService)
       {
         params=params.set("IsService",searchViewModel.IsService.toString());
       }
       if(searchViewModel.BranchID)
       {
         params=params.set("BranchID",searchViewModel.BranchID.toString());
       }
      
     return this._apiService.get(`/${this.controller}/Get?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,params);
   }
   setAsServiceItem(id:number, serviceID:number){
    return this._apiService.update(`/${this.controller}/SetAsServiceItem?id=${id}&serviceID=${serviceID}`)
  }
   setAsNotServiceItem(id:number){
    return this._apiService.update(`/${this.controller}/SetAsNotServiceItem?id=${id}`)
  }
  update(viewModel:ItemViewModel){
    return this._apiService.update(`/${this.controller}/Put`,viewModel)
  }

  GetServicesItems(){
    return this._apiService.get(`/${this.controller}/GetServicesItems`)
  }
  
  GetServicesIcon(){
    return this._apiService.get(`/owner/${this.controller}/GetServicesIcon`)
  }


  changeIsTopPriority(model){
    return this._apiService.update(`/Item/UpdatePriority`,model)

  }
}
