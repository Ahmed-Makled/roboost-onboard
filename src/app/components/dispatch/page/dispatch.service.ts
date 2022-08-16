import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { DispatchSearchViewModel } from './view-models/dispatch-search.model';
import { ApiService } from 'src/app/service/api.service';
import { DispatchAgentViewModel, DispatchOrderViewModel, DispatchSelectItemViewModel, DispatchTripViewModel } from './view-models/dispatch.model';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { OrderKpiViewModel, TripKpiViewModel } from './partial/_kpai/view-models/kpi.model';
import { FilterViewModel } from './view-models/filter.model';
import { DispatchUtilsViewModel } from './view-models/dispatch.utils';
import { ServiceItemViewModel } from './view-models/order-create.model';
import { TripLogViewModel } from './view-models/log.model';
import { OrderStatus } from 'src/app/enum/order-status.enum';

@Injectable({
  providedIn: 'root'
})

export class DispatchService {
  
  private deliverymanController='Deliveryman';
  private userController='User';

  page: CRUDIndexPage
  pageUtils:DispatchUtilsViewModel
  modalRef: BsModalRef;
  filter: FilterViewModel;
  tasks: DispatchOrderViewModel[] = []
  trips: DispatchTripViewModel[] = []
  agents: DispatchAgentViewModel[] = []
  selectedOrder: DispatchOrderViewModel = new DispatchOrderViewModel()
  searchViewModel: DispatchSearchViewModel = new DispatchSearchViewModel();
  tripKpi: TripKpiViewModel = new TripKpiViewModel()
  tripLog: TripLogViewModel = new TripLogViewModel()
  storeList: DispatchSelectItemViewModel[] = []
  areaList: DispatchSelectItemViewModel[] = []
  districtList: DispatchSelectItemViewModel[] = []
  serviceList: ServiceItemViewModel[] = []

  @Output() modalRefEvent = new EventEmitter<BsModalRef>();
  
  constructor(
    private _apiService:ApiService,
  ) { }
  
  onModalRefChange() {
    this.modalRefEvent.emit(this.modalRef);
  }

 
  startInterval() {
    clearInterval(this.pageUtils.SecondInterval)
    this.pageUtils.SecondInterval = setInterval(() => {
      this.trips.forEach(element => {
        if (element.DeliverymanID > 0)
          element.SpentTime += 1
        if (element.ArrivalTimeSecond > 0 && element.PickupTime == null) {
          element.ArrivalTimeSecond += 1;
        }
      });
      this.tasks.forEach(element => {
        if (element.Status != OrderStatus.DELIVERED && element.Status != OrderStatus.DELIVERED_MANUALLY)
          element.SpentTime += 1
      });
    }, 1000);
  }

  getRunningAgents(searchViewModel:DispatchSearchViewModel) {
    let params = new HttpParams();
    if (searchViewModel.StoreID) {
      params = params.set("branchID", searchViewModel.StoreID.toString());
    }
    return this._apiService.get(`/${this.deliverymanController}/GetDispatcherDeliverymen`);
  }
  updateDispatchFilter(params:string){
    return this._apiService.update(`/${this.userController}/UpdateDispatchFilter`,{DispatchFilter:params});
  }
  getDispatchFilter(){
    return this._apiService.get(`/${this.userController}/GetDispatchFilter`);
  }

  setAnimationTimeout(item: DispatchOrderViewModel) {
    item.IsAction = true
    setTimeout(() => {
      item.IsAction = false
    }, 8000);
  }
}


