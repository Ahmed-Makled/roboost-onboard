import { Component, OnInit} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderPriorityViewModel } from '../view-models/order-priority.model';
import { OrderPriorityService } from '../order-priority.service';
import { OrderPriorityEditViewModel } from '../view-models/order-priority-edit.model';
import { SharedService } from 'src/app/service/shared.service';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';



@Component({
  selector: 'order-priority',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class OrderPriorityComponent implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  items: OrderPriorityViewModel[] = [];
  selectedItem: OrderPriorityViewModel = new OrderPriorityViewModel();
  modalRef: BsModalRef;
  branchID:number
  index: number = 1;
  constructor(
    private _sharedService: SharedService,
    private _OrderPriorityService: OrderPriorityService,
    private  activatedRoute:ActivatedRoute
  ) {
  }



  ngOnInit() {
   this.branchID =  this.activatedRoute.snapshot.params['id']
    this.page.columns = [
      { Name: "ID", Title: "order-priority.id", Selectable: true, Sortable: true },
      { Name: "BranchName", Title: "order-priority.branch-name", Selectable: true, Sortable: true },
      { Name: "DistanceStatus", Title: "order-priority.distance-status", Selectable: true, Sortable: true },
      {Name : "DeliveryTimeStatus",Title:"order-priority.delivery-time-status",Selectable:true ,Sortable:false},
      {Name : "Priority",Title:"order-priority.priority",Selectable:true ,Sortable:false}
    ];
    this.search();
  }

  search() {
    this.page.isSearching = true;
     this._OrderPriorityService.get(this.branchID).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.items = response.Data.Items as OrderPriorityViewModel[];
      }
    });
  }
  ChangePriority(id:number,event)
  {
    this.page.isSearching = true;
    var OrderPriority:OrderPriorityEditViewModel=new OrderPriorityEditViewModel();
     OrderPriority.ID=id
     OrderPriority.Priority=event.target.value
    this._OrderPriorityService.ChangePriority(OrderPriority).subscribe(response => {
     this.page.isSearching = false;
     this._sharedService.showToastr(response)
     if (response.Success) {
       this.search()
     }
   });
 }
  
 
}
