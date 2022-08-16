import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { bound, SharedService } from 'src/app/service/shared.service';
import { ListService } from 'src/app/service/list.service';
import { DispatchAgentViewModel, DispatchOrderViewModel, DispatchSelectItemViewModel, DispatchTripViewModel } from '../view-models/dispatch.model';
import { DispatchSearchViewModel } from '../view-models/dispatch-search.model';
import { DispatchService } from '../dispatch.service';
import { FilterViewModel, GroupingTypeEnum, RecentOldestEnum } from '../view-models/filter.model';
import { forkJoin, merge, Subscription } from 'rxjs';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { TripStatus } from 'src/app/enum/trip-status';
import { OrderStatus } from 'src/app/enum/order-status.enum';
import { DeliveryStatus } from 'src/app/enum/delivery-status';
import { ServiceItemViewModel } from '../view-models/order-create.model';
import { FormGroup, Validators } from '@angular/forms';
import { DeliveryTimeStatus } from 'src/app/enum/delivery-time-status';
import { DispatchUtilsViewModel } from '../view-models/dispatch.utils';
import { CdkDrag, CdkDragMove, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { ScheduledOrderViewModel, SpecialTripViewModel, UpdateOrderInfoViewModel, } from '../view-models/dispatch-create.model';
import { OrderKpiViewModel, TripKpiViewModel } from '../partial/_kpai/view-models/kpi.model';
import { TaskLogViewModel } from '../view-models/log.model';
import { TripLogViewModel } from '../view-models/log.model';
import { OrderAction } from 'src/app/enum/order-action.enum';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { DispatchActionEnum } from '../view-models/dispatch-action.enum';
import { TaskActionService } from 'src/app/components/dispatch/page/service/task/task.action';
import { TripActionService } from 'src/app/components/dispatch/page/service/trip/trip.action';
import { DispatchUtilsService } from 'src/app/components/dispatch/page/service/dispatch.utils';
import { DragDropUtilsService } from 'src/app/components/dispatch/page/service/drag-drop.utils';
import { GuidedTourTestService } from 'src/app/lib/guided-tour.service';
import { GuidedTour, Orientation, TourStep } from 'src/app/lib/guided-tour.constants';
import { FilterTourStepEnum } from 'src/app/components/shared/layout/layout.component';

@Component({
  selector: 'dispatch-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})

export class IndexComponent implements OnInit, OnDestroy {
  featureEnum = FeatureEnum
  page: CRUDIndexPage = new CRUDIndexPage();
  pageUtils: DispatchUtilsViewModel = new DispatchUtilsViewModel();
  filter: FilterViewModel = new FilterViewModel()
  modalRef: BsModalRef;
  searchViewModel: DispatchSearchViewModel = new DispatchSearchViewModel();
  trips: DispatchTripViewModel[] = [];
  orders: DispatchOrderViewModel[] = [];
  agents: DispatchAgentViewModel[] = []
  selectedOrder: DispatchOrderViewModel = new DispatchOrderViewModel()
  storeList: DispatchSelectItemViewModel[] = []
  areaList: DispatchSelectItemViewModel[] = []
  serviceList: ServiceItemViewModel[] = []
  orderKpi: OrderKpiViewModel = new OrderKpiViewModel()
  tripKpi: TripKpiViewModel = new TripKpiViewModel()
  tripLog: TripLogViewModel = new TripLogViewModel()
  zoom = 11;
  previous: any;
  public dispatchGeneralTour: GuidedTour = {
    tourId: 'dispatch-general-tour',
    useOrb: false,
    preventBackdropFromAdvancing: true,
    skipCallback: (stepSkippedOn: number) => {
      this.dispatchGeneralTour.steps.map((value: TourStep, index: number) => {
        value.skipStep = false
      })
      this.modalRef?.hide()
    },
    completeCallback: () => { this.showCompleteTourTemplate() },
    steps: [
      {
        title: "Welcome to Roboost!",
        titleClass: 'c-b500',
        selector: '#WelcomeStep',
        content: "This is our dispatching page, where you can monitor and manage all your running live operations such as your deliverymen's status as well as the current ongoing trips, in addition to the all tasks uploaded on the system😊",
        orientation: Orientation.Right,
        action: () => {

          scrollToView('TaskNumberStep')
        },
        highlightPadding: 3,
      },
      {
        title: "Task Number",
        selector: '#TaskNumberStep',
        content: "<div class='mb-3'>One of our first features you can find is 'Task Number'.</div> From here, you can search for any details regarding the tasks, agents, and trips, while grouping and sorting the results as you may like.",
        orientation: Orientation.Bottom,

        action: () => {
        },
        highlightPadding: 0,
      },
      {
        title: "Stores, Hubs & Areas",
        selector: '#FilterBYStep',
        content: "<div class='mb-3'>Using this you can view your data according to <span class='c-g900 bold'>store, hub, or area</span>; thus, making things much easier to navigate through 👌</div> In addition, if there is an <span class='c-r500'>issue</span> with any store, hub or area you will be able to see it and locate the source of the problem!",
        orientation: Orientation.Bottom,

        action: () => {
          // scrollToView('searchStep')
        },
        highlightPadding: 0,
      },
      {
        title: "KPI's & Statistics",
        selector: '#KpiStep',
        content: "Here is where you can find a summary of the KPI's and statistics of your operations in a quick, efficient manner!",
        orientation: Orientation.Bottom,

        action: () => {
          // scrollToView('searchStep')
        },
        highlightPadding: 8,
      },
      {
        title: "Delivery Agents",
        selector: '#accordionAgentCard',
        content: "<div class='mb-3'>You can swiftly view all the delivery agents on shift while sectioning them according to their hub.</div> <div class='mb-3'>In addition, you can see whether the delivery agent is <span class='c-lb500' >on-duty</span>, <span class='c-gr600'>available</span>, on <span class='c-y600'>break</span>, or <span class='c-g700'>penalized</span>.</div> Note: A hub is a meeting point of delivery agents which you can create the configuration for from here 🛠",
        orientation: Orientation.Bottom,

        action: () => {
          scrollToView('TaskNumberStep')
        },
        highlightPadding: 8,
        overlayRadius: 6

      },
      {
        title: "On Going Trips",
        selector: '#accordionTripCard',
        content: "From 'On-going Trips', you can see all the running trips in real-time.",
        orientation: Orientation.TopLeft,

        action: () => {
          scrollToView('accordionAgentCard')
        },
        highlightPadding: 8,
        overlayRadius: 6
      },
      {
        title: "All Tasks",
        selector: '#AllTaskStep',
        content: "Lastly, this is where you can find all the undispatched tasks! 🧱",
        orientation: Orientation.TopLeft,

        action: () => {
          scrollToView('AllTaskStep')
        },
        highlightPadding: 8,
        overlayRadius: 6
      },

    ],
  };
  public dispatchTripInfoTour: GuidedTour = {
    tourId: 'dispatch-trip-info-tour',
    useOrb: false,
    preventBackdropFromAdvancing: true,
    skipCallback: (stepSkippedOn: number) => {
      this.dispatchGeneralTour.steps.map((value: TourStep, index: number) => {
        value.skipStep = false
      })
      this.modalRef?.hide()
    },
    completeCallback: () => { this.showCompleteTourTemplate() },
    steps: [
      {
        title: "Delivery Agent",
        selector: '#TripInfoStep_header',
        content: "First off, you can find a picture of the delivery agent and followed by his/her name.",
        orientation: Orientation.Right,
        highlightPadding: 0,
        overlayRadius: 6,
        action: () => {

        },

      },
      {
        title: "Hub Name",
        selector: '#TripInfoStep_header',
        content: "Under the delivery agent's name, you can also find the hub name from which the delivery agent is dispatched from.",
        orientation: Orientation.Right,
        highlightPadding: 0,
        highlightHeight: 30,
        overlayRadius: 6,
        action: () => {
          document.getElementById('TripInfoStep_hubName').classList.add("b-2", "bc-b500", "radius-6")
        },
        closeAction() {
          document.getElementById('TripInfoStep_hubName').classList.remove("b-2", "bc-b500", "radius-6")
        },

      },
      {
        title: "Trip Status",
        selector: '#TripInfoStep_header',
        content: "A trip's status can also be viewed from here.",
        orientation: Orientation.Right,
        highlightPadding: 0,
        highlightHeight: 30,
        overlayRadius: 6,
        action: () => {
          document.getElementById('TripInfoStep_status').classList.add("b-2", "bc-b500", "radius-6", 'rb-p-2')
        },
        closeAction() {
          document.getElementById('TripInfoStep_status').classList.remove("b-2", "bc-b500", "radius-6" , 'rb-p-2')
        },
      },
      {
        title: "Trip Number",
        selector: '#TripInfoStep_header',
        content: "Next is the trip's number as well as the number of tasks this trip contains 🔢",
        orientation: Orientation.Right
        ,
        highlightPadding: 0,
        highlightHeight: 30,
        overlayRadius: 6,
        action: () => {
          document.getElementById('TripInfoStep_number').classList.add("b-2", "bc-b500", "radius-6")
        },
        closeAction() {
          document.getElementById('TripInfoStep_number').classList.remove("b-2", "bc-b500", "radius-6")
        },
      },
      {
        title: "Waiting Time in to Pickup",
        selector: '#TripInfoStep_header',
        content: "<div class='mb-3'>From this timer, you can see how long it took for the agent to pick up the ready tasks. You will see that as the color yellow, but when the agents start the trip you will see the icon as green 🎨</div> Tip: since it is our main goal to optimize the delivery process, we set this up to help you to monitor even the smallest details like how long each pick-up location holds up the agents till it gives out the task to them ⏸",
        orientation: Orientation.Right   ,
        highlightPadding: 0,
        highlightHeight: 30,
        overlayRadius: 6,
        action: () => {
          document.getElementById('TripInfoStep_waitTime').classList.add("b-2", "bc-b500", "radius-6","rb-p-2")
        },
        closeAction() {
          document.getElementById('TripInfoStep_waitTime').classList.remove("b-2", "bc-b500", "radius-6","rb-p-2")
        }
        },

    ],
  };
  currentIndexTour = null

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _pageService: DispatchService,
    private _sharedService: SharedService,
    private _listService: ListService,
    private _taskAction: TaskActionService,
    private _tripAction: TripActionService,
    private _dispatchUtils: DispatchUtilsService,
    private _dragDropUtils: DragDropUtilsService,
    private guidedTourService: GuidedTourTestService,

  ) {

  }

  public onTourStart(): void {
    this._sharedService.StartTourEvent.subscribe(res => {
      this.currentIndexTour = res
      // this.dispatchGeneralTour.steps.map((value: TourStep, index: number)=>{
      //   index<this.currentIndexTour ? value.skipStep=true:value
      // })
      if (res == FilterTourStepEnum.General) this.guidedTourService.startTour(this.dispatchGeneralTour);
      if (res == FilterTourStepEnum.TripCardInfo) this.guidedTourService.startTour(this.dispatchTripInfoTour);

    })
  }

  @ViewChild('TourCompleteTemplate', { static: false }) TourCompleteTemplate: any;

  showCompleteTourTemplate() {
    this.modalRef = this._sharedService.modalService.show(this.TourCompleteTemplate, { class: 'modal-300' });

  }




  ngOnDestroy(): void {
    clearInterval(this.pageUtils.SecondInterval)
    this.subs.unsubscribe();
    this.modalRef?.hide();
  }
  ngAfterViewInit() {
    const onMove$ = this.dragEls.changes.pipe(startWith(this.dragEls), map((d: QueryList<CdkDrag>) => d.toArray()), map(dragels => dragels.map(drag => drag.moved)), switchMap(obs => merge(...obs)), tap(this.triggerScroll));
    this.subs.add(onMove$.subscribe());
    const onDown$ = this.dragEls.changes.pipe(startWith(this.dragEls), map((d: QueryList<CdkDrag>) => d.toArray()), map(dragels => dragels.map(drag => drag.ended)), switchMap(obs => merge(...obs)), tap(this.cancelScroll));
    this.subs.add(onDown$.subscribe());
  }

  ngOnInit() {
    this._pageService.page = this.page
    this._pageService.pageUtils = this.pageUtils
    this._pageService.filter = this.filter
    this.orders = this._pageService.tasks
    this.initializePage();
  }

  hasFeature(value: FeatureEnum) {
    return SharedService.featureList.some(i => i == value)
  }
  disabledSubmit(form: FormGroup) {
    return this.page.isSaving || !form.valid;
  }
  isMobileView(): boolean {
    return this._sharedService.isMobileView()
  }

  initializePage() {
    this.setTaskTabs()
    forkJoin([
      this._listService.getAreaList(),
      this._pageService.getDispatchFilter(),
    ]).subscribe(res => {
      this.areaList = res[0].Data;
      this._pageService.areaList = this.areaList
      if (res[1].Data) {
        this._dispatchUtils.getDispatchFilter(res[1].Data)
      }
      this.getStoreList()
      this.getRunningAgent()
      this.getRunningTrips()
      this.getRunningOrders()
      this._pageService.startInterval()
      this.getServiceList()
      this.getKpi()
      this.page.isPageLoaded = true
    });
    this.mapStoreList()
    this.onTourStart()

  }

  getRunningAgent() {
    this._pageService.getRunningAgents(this.searchViewModel).subscribe((res) => {
      if (res.Success) {
        this.agents = res.Data;
        this._pageService.agents = this.agents
        this._dispatchUtils.setNumberOfAgents()
        this.pageUtils.IsAgentSearching = false
      }
    })
  }
  getRunningTrips() {
    this._tripAction.getRunningTrips(() => {
      this.trips = this._pageService.trips
      console.log(this.trips);

      this._dispatchUtils.setNumberOfTrips()
      let isRecent = this.filter.RecentOrOldest.find(i => i.Selected).ID == RecentOldestEnum.RECENT
      this._sharedService.sortBy(this.getTripList(), { prop: "SpentTime", desc: !isRecent })
    })
  }
  getRunningOrders() {
    this._taskAction.getRunningOrders(() => {
      this.orders = this._pageService.tasks
      // console.log(this.orders.filter(i=>i.TripID > 0 && !this.trips.some(x=>x.ID == i.TripID)))
      this._dispatchUtils.setNumberOfOrders()
      this.sortDispatch()
    })
  }
  getKpi() {
    forkJoin([
      this._taskAction._taskService.getOrderKPi(),
      this._tripAction._tripService.getTripKPi()
    ]).subscribe(res => {
      this.orderKpi = res[0].Data
      this.orderKpi.AvgDeliveryTime = res[0].Data.AvgDeliveryTime ?? 0
      this.tripKpi = res[1].Data
      this.pageUtils.IsKpisSearching = false
    });
  }

  getStoreList() {
    this._listService.getBranchListWithLocation().subscribe((res) => {
      this.storeList = res.Data
      this._pageService.storeList = this.storeList
      if (!this.isSingleStore())
        this._activatedRoute.queryParams.subscribe((params) => {
          if (Object.keys(params).length > 0) {
            this._dispatchUtils.getFilterAndSorting(params)
          }
        })
    })
  }
  getServiceList() {
    this._listService.getServicesItems().subscribe((res) => {
      this.serviceList = res.Data
    })
  }


  ////////// Store /////////
  getStoreName(id: number): string {
    return this.storeList.find(i => i.ID == id)?.Name
  }
  isSingleStore() {
    return this._sharedService._storageService.getISSingleStore()
  }

  anyStoreOrAreaSelected(): boolean {
    return this.filter.FiltterType == GroupingTypeEnum.STORE ? this.storeList.some(i => i.Selected) : this.areaList.some(i => i.Selected)
  }

  //////////////////////////////////

  ////////// Agent /////////
  getAgentListForActions(branchID?: number): DispatchAgentViewModel[] {
    let agents: DispatchAgentViewModel[];
    agents = this.agents.filter((i) => (branchID == 0 ? true : i.BranchID == branchID) && i.ID != this.oldAgentID && i.StatusID == DeliveryStatus.AVAILABLE)
    if (this.agentTripSearchValue)
      return agents.filter(i => i.Name.toLowerCase().includes(this.agentTripSearchValue.toLowerCase()))
    else return agents
  }
  getTripAgent(item: DispatchTripViewModel) {
    return this.agents.find(i => i.ID == item.DeliverymanID)
  }
  isDmHasLocation(): boolean {
    return this.getTripAgent(this.selectedTrip)?.Latitude > 0 && this.getTripAgent(this.selectedTrip)?.Longitude > 0;;
  }
  //////////////////////  

  ///////// Task /////////
  @ViewChild('actionTamplate', { static: false }) actionTamplate: any;
  @ViewChild('scheduleOrderTemplate', { static: false }) scheduleOrderTemplate: any;
  @ViewChild('cancelOrderTemplate', { static: false }) cancelOrderTemplate: any;
  @ViewChild('removeOrderFromTripTemplate', { static: false }) removeOrderFromTripTemplate: any;
  @ViewChild('addToTripTemplate', { static: false }) addToTripTemplate: any;
  @ViewChild('updateOrderInfoTemplate', { static: false }) updateOrderInfoTemplate: any;

  selectedTripID: number;
  scheduledOrderModel: ScheduledOrderViewModel = new ScheduledOrderViewModel()
  orderEditModel: UpdateOrderInfoViewModel = new UpdateOrderInfoViewModel()
  updateOrderInfoForm: FormGroup
  showNote: boolean
  taskLog: TaskLogViewModel = new TaskLogViewModel()

  onOrderClick(value: any) {
    this.selectedOrder = value.item
    this._pageService.selectedOrder = this.selectedOrder
    if (!value.action) this.showTaskAction()
    else this.excuteActionOnTask(value.action, value.item)
  }
  showTaskAction() {
    this.selectedOrder.ShowOrderLocation = false
    this.selectedOrder.ShowTaskLog = false
    this.selectedOrder.ShowTaskDetails = false
    this.modalRef = this._sharedService.modalService.show(this.actionTamplate, { class: 'modal-order modal-transparent' });
  }
  excuteActionOnTask(action: DispatchActionEnum, item: DispatchOrderViewModel) {
    switch (action) {
      case DispatchActionEnum.PAUSE_ORDER: this.pauseOrder(item); break;
      case DispatchActionEnum.UNPAUSE_ORDER: this.unPauseOrder(item); break;
      case DispatchActionEnum.ADDED_TO_TRIP: this.showAddToTripTemplate(); break;
      case DispatchActionEnum.REMOVE_FROM_TRIP: this.removeOrderFromTrip(item); break;
      case DispatchActionEnum.CHANGE_TRIP: this.showChangeTripTemplate(); break;
    }
  }
  createUpdateTaskForm() {
    this.updateOrderInfoForm = this._sharedService.formBuilder.group({
      Address: [this.selectedOrder.Address, [Validators.required]],
      Note: [this.selectedOrder.Note],
    });
  }

  showRemoveOrderFromTripConfirmation() {
    this.modalRef = this._sharedService.modalService.show(this.removeOrderFromTripTemplate, { class: 'modal-330' });
  }
  showScheduledOrderTemplate(item: DispatchOrderViewModel) {
    this.scheduledOrderModel = new ScheduledOrderViewModel()
    this.scheduledOrderModel.OrderID = item.ID
    this.modalRef = this._sharedService.modalService.show(this.scheduleOrderTemplate, { class: 'modal-330' });
  }
  showCancelOrderConfirmation() {
    this.modalRef = this._sharedService.modalService.show(this.cancelOrderTemplate, { class: 'modal-330' });
  }
  showAddToTripTemplate() {
    this.selectedTripID = null
    this.pageUtils.oldTripID = -1
    this.modalRef = this._sharedService.modalService.show(this.addToTripTemplate, { class: 'modal-dialog modal-640' });
  }
  showChangeTripTemplate() {
    this.selectedTripID = null
    this.pageUtils.oldTripID = this.selectedOrder.TripID
    this.modalRef = this._sharedService.modalService.show(this.addToTripTemplate, { class: 'modal-dialog modal-640' });
  }
  showUpdateTaskTemplate() {
    this.orderEditModel = new UpdateOrderInfoViewModel()
    this.showNote = false
    this.createUpdateTaskForm()
    this.serviceList.forEach(element => { element.Selected = false; })
    if (this.selectedOrder.Services) {
      this._taskAction._taskService.getOrderServices(this.selectedOrder.ID).subscribe(res => {
        if (res.Success) {
          let services = res.Data
          this.serviceList.filter(i => services.some(x => x == i.ID)).forEach(element => { element.Selected = true })
        }
      })
    }
    this.modalRef = this._sharedService.modalService.show(this.updateOrderInfoTemplate, { class: 'modal-640' });
  }


  getTaskLog() {
    this._taskAction.getTaskLog(this.selectedOrder, this.taskLog)
  }
  removeOrderFromTrip(item: DispatchOrderViewModel, callback?) {
    return this._taskAction.removeOrderFromTrip(item, callback)
  }
  scheduledOrder() {
    this._taskAction.scheduledOrder(this.scheduledOrderModel)
  }
  cancelOrder(item: DispatchOrderViewModel) {
    this._taskAction.cancelOrder(item, (isSuccess) => { if (isSuccess) this.orderKpi.CanceledOrders += 1 })
  }
  pauseOrder(item: DispatchOrderViewModel, callback?) {
    this._taskAction.pauseOrder(item, callback)
  }
  unPauseOrder(item: DispatchOrderViewModel, callback?) {
    this._taskAction.unPauseOrder(item, callback)
  }
  changeOrderPriority(item: DispatchOrderViewModel, callback?) {
    this._taskAction.changeOrderPriority(item, callback)
  }
  setOrderAsDelivered(item: DispatchOrderViewModel) {
    this._taskAction.setOrderAsDelivered(item, (isSuccess) => { if (isSuccess) this.orderKpi.DeliveredOrders += 1 })
  }
  setOrderAsReady(item: DispatchOrderViewModel, callback?) {
    this._taskAction.setOrderAsReady(item, callback)
  }
  setOrderAsInProgress(item: DispatchOrderViewModel, callback?) {
    this._taskAction.setOrderAsInProgress(item, callback)
  }
  setOrderAsNew(item: DispatchOrderViewModel, callback?) {
    this._taskAction.setOrderAsNew(item, callback)
  }
  cancelOTP() {
    this._taskAction.cancelOTP(this.selectedOrder)
  }
  addToTrip(item: DispatchOrderViewModel, tripID: number, callback?) {
    this._taskAction.addToTrip(item, tripID, false, callback)
  }
  changeTrip(item: DispatchOrderViewModel, tripID: number, callback?) {
    this._taskAction.addToTrip(item, tripID, true, callback)
  }
  updateInfo() {
    Object.assign(this.orderEditModel, this.updateOrderInfoForm.value);
    this._taskAction.updateInfo(this.orderEditModel, this.selectedOrder, this.serviceList)
  }
  onCreateTask() {
    this.orderKpi.TotalOrders += 1
  }

  getTripOrderList(id: number, withUrgent: boolean): DispatchOrderViewModel[] {
    return this._taskAction._taskUtils.getTripOrderList(id, withUrgent)
  }
  getOnTripOrderList(): DispatchOrderViewModel[] {
    return this._taskAction._taskUtils.getOnTripOrderList()
  }
  getDeliveredOrderList(): DispatchOrderViewModel[] {
    return this.orders.filter(i => i.Status == OrderStatus.DELIVERED || i.Status == OrderStatus.DELIVERED_MANUALLY)
  }
  getTripDeliveredOrderList(id: number): DispatchOrderViewModel[] {
    return this.orders.filter(i => i.TripID == id && i.Status == OrderStatus.DELIVERED)
  }
  getTasks(status: OrderStatus): DispatchOrderViewModel[] {
    return this._taskAction._taskUtils.getTasks(status)
  }
  getTasksWithNoFilterStatus(status: OrderStatus): DispatchOrderViewModel[] {
    return this._taskAction._taskUtils.getTasksWithNoFilterStatus(status)
  }
  getTasksByStatus(status: OrderStatus): DispatchOrderViewModel[] {
    return this._taskAction._taskUtils.getTasksByStatus(status)
  }
  getUrgentTasksCount(items: DispatchOrderViewModel[], groupValue?: number): number {
    return this._taskAction._taskUtils.getUrgentTasksCount(items, groupValue)
  }
  getUrgentTripsTasksCount(): number {
    return this.getOrderList(this.orders).filter(i => i.TripID > 0 && i.DeliveryTimeStatus == DeliveryTimeStatus.TOP_URGENT).length
  }
  getOrdersStoresCount(items: DispatchOrderViewModel[]) {
    return [...new Set(items.map(i => i.BranchName))].length
  }
  getOrderUrlONMaps(item: DispatchOrderViewModel) {
    return this._taskAction._taskUtils.getOrderUrlONMaps(item)
  }
  getTaskLogDeliverd(item): boolean {
    return item.Action == OrderAction.DELIVERED || item.Action == OrderAction.DELIVERED_MANUALLY || item.Action == OrderAction.DELIVERED_BY_BRANCH_MANAGER
  }
  getTaskLogCreated(item): boolean {
    return item.Action == OrderAction.CREATED_BY_BRANCH_MANAGER || item.Action == OrderAction.CREATED_FROM_POS
  }
  getOrderLatitude(order: DispatchOrderViewModel) {
    return this._taskAction._taskUtils.getOrderLatitude(order)
  }
  getOrderLongtude(order: DispatchOrderViewModel) {
    return this._taskAction._taskUtils.getOrderLongtude(order)
  }
  getOrderMarker(order: DispatchOrderViewModel) {
    return this._taskAction._taskUtils.getOrderMarker(order)
  }
  getTotalItem() {
    return this._sharedService.getSumValues(this.taskLog.Items.map(i => i.Price))
  }

  isTripHasCantDeliver(id: number): boolean {
    return this._taskAction._taskUtils.isTripHasCantDeliverTask(id)
  }
  isCantDelivered(item: DispatchOrderViewModel) {
    return this._taskAction._taskUtils.isCantDelivered(item)
  }
  isOrderDelivered(item: DispatchOrderViewModel) {
    return this._taskAction._taskUtils.isOrderDelivered(item)
  }
  isOrderCanceled(item: DispatchOrderViewModel) {
    return this._taskAction._taskUtils.isOrderCanceled(item)
  }
  isOnTrip(item: DispatchOrderViewModel): boolean {
    return this._taskAction._taskUtils.isOnTrip(item)
  }
  isReady(item: DispatchOrderViewModel): boolean {
    return this._taskAction._taskUtils.isReady(item)
  }
  isCreated(item: DispatchOrderViewModel): boolean {
    return this._taskAction._taskUtils.isCreated(item)
  }
  isNew(item: DispatchOrderViewModel): boolean {
    return this._taskAction._taskUtils.isNew(item)
  }
  isSchedualed(item: DispatchOrderViewModel): boolean {
    return this._taskAction._taskUtils.isSchedualed(item)
  }

  /////////////////////////////////////////////

  //////////// Trip ////////////

  @ViewChild('cancelTripTemplate', { static: false }) cancelTripTemplate: any;
  @ViewChild('addAgentToTripTemplate', { static: false }) addAgentToTripTemplate: any;
  @ViewChild('tripActionsTemplate', { static: false }) tripActionsTemplate: any;

  selectedTrip: DispatchTripViewModel = new DispatchTripViewModel()
  agentTripSearchValue: any
  selectedAgentID: number;
  oldAgentID: number;

  showTripActionsTemplate(item: DispatchTripViewModel, event, sent: boolean) {
    if (sent) {
      this.selectedTrip = item;
      this.selectedTrip.showTripLog = false
      this.selectedTrip.showTracking = false;
      this.modalRef = this._sharedService.modalService.show(this.tripActionsTemplate, { class: 'modal-order modal-transparent' });
    }
    else event.stopPropagation();
  }
  showCancelTripConfirmation(item?: DispatchTripViewModel) {
    if (item) this.selectedTrip = item
    this.modalRef = this._sharedService.modalService.show(this.cancelTripTemplate, { class: 'modal-330' });
  }
  showAddAgentToTripTemplate(item: DispatchTripViewModel) {
    this.selectedTrip = item
    this.agentTripSearchValue = null
    this.oldAgentID = -1
    this.selectedAgentID = null
    this.modalRef = this._sharedService.modalService.show(this.addAgentToTripTemplate, { class: 'modal-dialog modal-640' });
  }
  showChangeTripAgentTemplate(item: DispatchTripViewModel) {
    this.selectedTrip = item
    this.agentTripSearchValue = null
    this.oldAgentID = this.selectedTrip.DeliverymanID
    this.modalRef = this._sharedService.modalService.show(this.addAgentToTripTemplate, { class: 'modal-dialog modal-640' });
  }
  showTripLog() {
    this.tripLog = new TripLogViewModel()
    this.selectedTrip.showTracking = false;
    this.selectedTrip.showTripLog = true
    this._tripAction.getTripLog(this.selectedTrip, () => { this.tripLog = this._pageService.tripLog })
  }
  showLiveTracking() {
    this.selectedTrip.showTracking = true;
    this.selectedTrip.showTripLog = false
    this.previous = null;
  }

  addAgentToTrip(item: DispatchTripViewModel, agentID: number, callback?) {
    this._tripAction.addAgentToTrip(item, agentID, this.agents, callback)
  }
  changeTripAgent(item: DispatchTripViewModel, agentID: number, callback?) {
    this._tripAction.changeTripAgent(item, agentID, this.agents, callback)
  }
  cancelTrip(item: DispatchTripViewModel, callback?) {
    this._tripAction.cancelTrip(item, this.orders, this.agents, callback)
  }
  closeTrip(item: DispatchTripViewModel, callback?) {
    this._tripAction.closeTrip(item, callback)
  }

  getTripById(id: number): DispatchTripViewModel {
    return this.trips.find(i => i.ID == id)
  }
  getTripListForActions(): DispatchTripViewModel[] {
    return this._tripAction._tripUtils.getTripListForActions()
  }

  isTripLogDeliveredOrCompleted(item): boolean {
    return item.Status == TripStatus.DELIVERED || item.Status == TripStatus.COMPLETED
  }
  isTripLogCreated(item): boolean {
    return item.Status == TripStatus.CREATED
  }
  isTripDelivered(id: number) {
    return this._tripAction._tripUtils.isTripDelivered(id)
  }

  //createSpecialTrip



  @ViewChild('createTripTemplate', { static: false }) createTripTemplate: any;
  tripForm: FormGroup
  tripModel: SpecialTripViewModel = new SpecialTripViewModel()
  tripReasonList: SelectItem[] = []

  createSpecialTrip() {
    Object.assign(this.tripModel, this.tripForm.value);
    this._tripAction.createSpecialTrip(this.tripModel)
  }
  createTripForm() {
    this.tripForm = this._sharedService.formBuilder.group({
      BranchID: [this.tripModel.BranchID, (this.isSingleStore() ? [] : [Validators.required])],
      SpecialTripReasonID: [this.tripModel.SpecialTripReasonID, [Validators.required]],
      SpecialTripReasonNote: [this.tripModel.SpecialTripReasonNote],
    });
  }
  showCreateTripTemplate(): void {
    this.onStartCreateTrip(!this.isSingleStore() && !this.isMobileView())
    this.modalRef = this._sharedService.modalService.show(this.createTripTemplate, { class: `modal-special-trip ${this.isSingleStore() ? 'modal-500' : ''}` });
    this._pageService.modalRef = this.modalRef
  }
  showCreateTrip() {
    this.onStartCreateTrip()
    this.pageUtils.pageCreateTrip = true
  }
  onStartCreateTrip(withRest: boolean = true) {
    if (withRest) {
      this.tripModel.BranchID = this.isSingleStore() ? 0 : this.storeList[0].ID
      this.createTripForm();
      this.pageUtils.oldTripID = -1
      this._taskAction._taskUtils.resetTaskList()
      this.agents.filter(i => i.Selected == true).forEach(order => { order.Selected = false; });
      this._tripAction.getReasonList(res => { this.tripReasonList = res.Data })
    }
    this.tripModel.DeliverymanID = null
    this.agentTripSearchValue = null
  }
  getCreateTripOrderList(withSelected: boolean = false): DispatchOrderViewModel[] {
    return this._taskAction._taskUtils.getCreateTripOrderList(this.tripModel.BranchID, withSelected)
  }
  isOtherReasonForTrip(): boolean {
    return this.specialTripReasonID.value == 3
  }
  onTripReasonChange() {
    if (this.isOtherReasonForTrip()) {
      this.specialTripReasonNote.setValidators(Validators.compose([Validators.required]))
    }
    else {
      this.specialTripReasonNote.clearValidators();
    }
    this.specialTripReasonNote.updateValueAndValidity();
  }
  disableCreateTrip(): boolean {
    return this.tripForm.invalid || !this.orders.some(i => i.isSelected) || this.tripModel.DeliverymanID == null
  }
  anyTaskSelected(): boolean {
    return this.orders.some(i => i.isSelected)
  }
  canShowPageCreateTrip(): boolean {
    return (this.isSingleStore() || this.isMobileView()) && this.pageUtils.pageCreateTrip
  }
  get specialTripReasonID() {
    return this.tripForm.get("SpecialTripReasonID")
  }
  get specialTripReasonNote() {
    return this.tripForm.get("SpecialTripReasonNote")
  }
  get specialTripBranch() {
    return this.tripForm.get("BranchID")
  }
  ///////////////////////////////////






  clickedMarker(infowindow: any) {
    if (this.previous) {
      this.previous?.close();
    }
    this.previous = infowindow;
  }
  onMapClick($event: MouseEvent) {
    this.previous?.close();
  }
  stopPropgation(event) {
    if (this.pageUtils.pageCreateTrip) {
      return false
    }
  }

  ///////////// Utils /////////////
  updateDispatchFilter() {
    this._dispatchUtils.updateDispatchFilter()
  }

  // ------------- Search ------------ 
  getTrips() {
    return this._dispatchUtils.getTrips()
  }
  getOrders(items: DispatchOrderViewModel[]) {
    return this._dispatchUtils.getOrders(items)
  }
  getSearchByValue(): string {
    return this._dispatchUtils.getSearchByValue()
  }

  // ------------ Grouping ------------ 
  isGroupingNone() {
    return this._dispatchUtils.isGroupingNone()
  }
  getGroupingList() {
    return this._dispatchUtils.getGroupingList()
  }
  getTripListByGrouping(item: any): DispatchTripViewModel[] {
    return this._dispatchUtils.getTripListByGrouping(item)
  }
  getOrderListByGrouping(item: any, orders: DispatchOrderViewModel[], withUrgent: boolean = false): DispatchOrderViewModel[] {
    return this._dispatchUtils.getOrderListByGrouping(item, orders, withUrgent)
  }
  onSelectGroupBy(item: SelectItem) {
    return this._dispatchUtils.onSelectGroupBy(item)
  }

  //---------sorting dispatch---------
  @ViewChild('sortingGroupingTemplate', { static: false }) sortingGroupingTemplate: any;
  showSortingGroupingTemplate() {
    this.filter.GroupByValue = this.filter.GroupingBy.find(i => i.Selected)?.ID
    this.filter.SortingValue = this.filter.SortingGroupsBy.find(i => i.Selected)?.ID
    this.filter.RecentValue = this.filter.RecentOrOldest.find(i => i.Selected).ID
    this.modalRef = this._sharedService.modalService.show(this.sortingGroupingTemplate, { class: 'modal-dialog modal-dialog-centered filter-model' });
  }
  resetSorting() {
    this._dispatchUtils.resetSorting()
  }
  sortDispatch() {
    this._dispatchUtils.sortDispatch()
  }
  onSortDispatchClick() {
    this._dispatchUtils.saveFilterAndSorting()
  }
  mapStoreList() {
    this.storeList = this.storeList.map(i => { return { ...i, NumberOfAgent: this.agents.filter(i => i.BranchID == i.ID).length } })
  }

  ///---------------- fliter ----------------
  getAgentList(id: number): DispatchAgentViewModel[] {
    return this._dispatchUtils.getAgentList(id)
  }
  getTripList(): DispatchTripViewModel[] {
    return this._dispatchUtils.getTripList()
  }
  getOrderList(items: DispatchOrderViewModel[]): DispatchOrderViewModel[] {
    return this._dispatchUtils.getOrderList(items)
  }
  getFilterByValue(): string {
    return this._dispatchUtils.getFilterByValue()
  }
  onFilterClick(item: DispatchSelectItemViewModel) {
    let filterBy = +this._activatedRoute.snapshot.queryParams["filterType"]
    this._dispatchUtils.onFilterClick(item, filterBy)
  }
  onUrgentClick(canFiltter: boolean, withUrgent: boolean) {
    // if(canFiltter)
    withUrgent = !withUrgent
  }
  resetFilter() {
    this.areaList.forEach(i => i.Selected = false)
    this.storeList.forEach(i => i.Selected = false)
    // this._dispatchUtils.saveFilterAndSorting()
  }

  getFiltterByList(): DispatchSelectItemViewModel[] {
    return this._dispatchUtils.getFiltterByList()
  }
  getUrgentTaskStoreCount(id) {
    return this._taskAction._taskUtils.getUrgentTaskStoreCount(id)
  }
  isSeletedInFilter(id: number): boolean {
    return this.filter.FiltterValue.split('_').some(i => i == id.toString())
  }
  /////////////////////////////


  /////////// Tabs ///////////
  setTaskTabs() {
    this._dispatchUtils.setTaskTabs()
  }
  onTasksTabClick(index: number) {
    this._dispatchUtils.onTasksTabClick(index)
  }
  getTabList() {
    return this._dispatchUtils.getTabList()
  }
  getOrderRowClass(groupItem) {
    return this._dispatchUtils.getOrderRowClass(groupItem)
  }
  getOrderGroupingColClass(groupItem) {
    return this._dispatchUtils.getOrderGroupingColClass(groupItem)
  }
  getPausedOrdersCount(item: any, orders: DispatchOrderViewModel[]) {
    return this._dispatchUtils.getPausedOrdersCount(item, orders)
  }
  getOrderCountForCol(item) {
    return this._dispatchUtils.getOrderCountForCol(item)
  }

  //#region drag and drop
  drop(event: any) {
    this._dragDropUtils.drop(event)
  }

  onDrop(item: DispatchOrderViewModel, source, target, afterDropCallback) {
    this._dragDropUtils.onDrop(item, source, target, afterDropCallback)
    if ((item.Status == OrderStatus.New || item.Status == OrderStatus.CREATED || item.Status == OrderStatus.READY) &&
      +target.id == OrderStatus.SCHEDULED) {
      if (!this.hasFeature(this.featureEnum.Task_ScheduleOrder) || !this._dragDropUtils.canDrop(OrderStatus.SCHEDULED)) return false;
      this.showScheduledOrderTemplate(this.orders.find(i => i.ID == item.ID))
    }
  }
  onDragMoved(event) {
    this._dragDropUtils.onDragMoved(event)
  }
  getDropListElement(element: Element): Element {
    return this._dragDropUtils.getDropListElement(element)
  }
  canDropOrder(event): boolean {
    return true;
  }
  canDropReadyOrder(event): boolean {
    let sourceID: OrderStatus = (event.data as DispatchOrderViewModel).Status
    return sourceID == OrderStatus.CREATED || sourceID == OrderStatus.SCHEDULED
  }
  canDrop(sourceID: OrderStatus) {
    return this._dragDropUtils.canDrop(sourceID)
  }
  canDropOrderToTrip(event): boolean {
    let item: DispatchOrderViewModel = event.data
    return true;
  }
  dropListEnterPredicate(drag: CdkDrag, drop: CdkDropList) {
    return false;
  };
  //#endregion drag and drop


  //#region scroll

  @ViewChild('scrollEl')
  scrollEl: ElementRef<HTMLElement>;
  @ViewChildren(CdkDrag)
  dragEls: QueryList<CdkDrag>;
  subs = new Subscription();
  private animationFrame: number | undefined;
  @bound
  public triggerScroll($event: CdkDragMove) {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
    this.animationFrame = requestAnimationFrame(() => this.scroll($event));
  }
  @bound
  private cancelScroll() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
  }

  private scroll($event: CdkDragMove) {
    const { y } = $event.pointerPosition;
    const baseEl = this.scrollEl.nativeElement;
    const box = baseEl.getBoundingClientRect();
    const scrollTop = baseEl.scrollTop;
    const top = box.top + - y;
    if (top > 0 && scrollTop !== 0) {
      const newScroll = scrollTop - this.pageUtils.ScrollSpeed * Math.exp(top / 50);
      baseEl.scrollTop = newScroll;
      this.animationFrame = requestAnimationFrame(() => this.scroll($event));
      return;
    }
    const bottom = y - box.bottom;
    if (bottom > 0 && scrollTop < box.bottom) {
      const newScroll = scrollTop + this.pageUtils.ScrollSpeed * Math.exp(bottom / 50);
      baseEl.scrollTop = newScroll;
      this.animationFrame = requestAnimationFrame(() => this.scroll($event));
    }
  }
  //#endregion scroll


}

function scrollToView(id: string) {
  var elment = document.getElementById(id);
  elment.scrollIntoView(true);
}