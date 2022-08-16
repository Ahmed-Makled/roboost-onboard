
import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CustomerMainInfo } from '../view-models/customer-main-info.model';
import { CustomerProfileKPI } from '../view-models/cusyomer-profile-kpi.model';
import { CRUDCreatePage } from 'src/app/model/shared/crud-create.model';
import { SharedService } from 'src/app/service/shared.service';
import { CustomerProfileService } from '../../../profile.service';


@Component({
  selector: 'personal-info',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class PersonalInfoComponent implements OnInit {

  modalRef: BsModalRef;
  page: CRUDCreatePage = new CRUDCreatePage();
  mainInfo: CustomerMainInfo = new CustomerMainInfo();
  modelKPI: CustomerProfileKPI = new CustomerProfileKPI();

  constructor(
    public _sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private _customerProfileService: CustomerProfileService
  ) { }
  ngOnChanges(): void {
    
  }
  ngOnInit() {
    var id
    this.activatedRoute.params.subscribe(params => {
      id = params['id']
      forkJoin([
        this._customerProfileService.getCustomerMainInfo(id),
        this._customerProfileService.getCustomerProfileKPI(id)
      ]).subscribe(res => {
    
        if (res[0].Success&&res[0].Data != null)
          this.mainInfo = res[0].Data
        if(res[1].Success && res[1].Data != null)
          this.modelKPI = res[1].Data
          this.page.isPageLoaded=true
      }

      );
    })
  }

}

