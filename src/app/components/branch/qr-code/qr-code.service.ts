
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/service/api.service';


@Injectable({
  providedIn: 'root'
})
export class GenerateQRCodeService {

  constructor(private apiService: ApiService) { }

  get(id:number){
    let params = new HttpParams();
    if (id) {
      params = params.set("branchID", id.toString());
    }
    return this.apiService.get(`/Branch/GetQrCode`,params);
  }
 

 
}
