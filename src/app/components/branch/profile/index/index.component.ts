import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { OrderBranchConfigurationViewModel } from '../view-models/order-branch-configuration.model';
import { TripBranchConfigurationViewModel } from '../view-models/trip-branch-configuration.model';
import { CRUDCreatePage } from 'src/app/model/shared/crud-create.model';
import { SharedService } from 'src/app/service/shared.service';



@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  pageOrderConfg: CRUDCreatePage = new CRUDCreatePage();
  pageTripConfg: CRUDCreatePage = new CRUDCreatePage();
  orderBranchConfigurationModel: OrderBranchConfigurationViewModel = new OrderBranchConfigurationViewModel();
  tripBranchConfigurationModel: TripBranchConfigurationViewModel = new TripBranchConfigurationViewModel();
  modalRef: BsModalRef;
  sideActive:any[] = [{isActive : true} , {isActive : false} , {isActive : false} ,
    {isActive : false} , {isActive : false}  ]

  constructor(
    public _sharedService: SharedService,
  ) { }
  ngOnInit() {
  }
 

  activeSide(index,el){
    this.sideActive.forEach(element => {
      element.isActive = false
    }); 
    this.sideActive[index].isActive = true ; 
    document.getElementById(el).scrollIntoView({behavior:"smooth"})

  }
    

}

