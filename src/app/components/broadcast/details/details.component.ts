import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { BroadcastService } from '../broadcat.service';
import { AgentsDetailsViewModel, NotificationDetailsViewModel } from './view-models/notification-details-model';
@Component({
  selector: 'app-broadcast-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class BroadcastDetailsComponent implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  notificationDetails: NotificationDetailsViewModel = new NotificationDetailsViewModel();
  assignedAgents: AgentsDetailsViewModel = new AgentsDetailsViewModel();
  notificationCode: number;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _broadcastService: BroadcastService,
  ) { }
  ngOnInit(): void {
    this.initializePage()
  }
  initializePage() {
    this.page.isPageLoaded = false;
    this._activatedRoute.params.subscribe(params => {
      this.notificationDetails.Code = params['code']
    })
    this.page.columns = [
      { Name: "Agent", Title: "system.deliveryman-name", Selectable: true, Sortable: true },
      { Name: "Sent", Title: "broadcast.sent", Selectable: true, Sortable: true },
      { Name: "Received", Title: "broadcast.received", Selectable: true, Sortable: true },
      { Name: "Viewed", Title: "broadcast.viewed", Selectable: true, Sortable: true },
    ];
    forkJoin([
      this._broadcastService.getDetailsMainInfo(this.notificationDetails.Code),
      this._broadcastService.getDetailsAgents(this.notificationDetails.Code)
    ]).subscribe(res => {
      if (res[0].Success && res[1].Success) {
        this.notificationDetails = res[0].Data;
        this.assignedAgents = res[1].Data.Items;
        this.page.isPageLoaded = true;
      }
    })
  }
}
