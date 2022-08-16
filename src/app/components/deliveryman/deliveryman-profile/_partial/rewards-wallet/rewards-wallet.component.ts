import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DeliverymanService } from '../../../home/deliveryman.service';
import { DeliverymanRewardViewModel } from './view-models/deliveryman-reward-view-model';
import { DeliverymanWalletSummaryViewModel } from './view-models/deliveryman-wallet-summart.model';
import { StatisticViewModel } from './view-models/statistic.model';


@Component({
  selector: 'rewards-wallet',
  templateUrl: './rewards-wallet.component.html',
  // styleUrls: [ './performance.component.css']
})
export class RewardsWalletComponent implements OnInit, OnChanges {

  deliverymanID: number = 0
  deliverymanWallet: DeliverymanWalletSummaryViewModel = new DeliverymanWalletSummaryViewModel()
  deliverymanReward: DeliverymanRewardViewModel = new DeliverymanRewardViewModel()
  deliverymanstatistic: StatisticViewModel = new StatisticViewModel()
  monthNames: string[] = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  currentMonth: string
  currentYear: string
  avgOnShift: number = 0

  @Input() numOfDays: number
  constructor(
    private activatedRoute: ActivatedRoute,
    private _deliverymanService: DeliverymanService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.initializePage();
  }
  ngOnInit(): void {
    // this.initializePage();
    var date = new Date();
    this.currentMonth = this.monthNames[date.getMonth()]
    this.currentYear = date.getFullYear().toString()
  }
  initializePage() {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.deliverymanID = +params.get("id");
      }

      forkJoin([
        this._deliverymanService.getDMWalletSummary(this.deliverymanID, this.numOfDays),
        this._deliverymanService.getDMRewards(this.deliverymanID, this.numOfDays),
        this._deliverymanService.getDeliverymanStatistic(this.deliverymanID, this.numOfDays),
        this._deliverymanService.getAvgOnShift(this.deliverymanID, this.numOfDays)
      ]).subscribe((res: any) => {
        this.deliverymanWallet = res[0].Data
        this.deliverymanReward = res[1].Data
        this.deliverymanstatistic = res[2].Data
        this.avgOnShift = res[3].Data
      }
      );

    });
  }

}

