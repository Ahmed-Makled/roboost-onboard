
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { log } from 'console';
import * as moment from 'moment';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { RankingAgentService } from '../../home/ranking-agent.service';
import { DeliverymanRankByPointSearchViewModel } from '../../home/view-models/ranking-search.model';
import { DeliverymanRankByPointViewModel } from '../../home/view-models/ranking.model';



@Component({
  selector: 'app-index',
  templateUrl: './deliverymen-ranking.component.html',
  styleUrls: ['./deliverymen-ranking.component.css']
})
export class DeliverymenRankingComponent implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  items:DeliverymanRankByPointViewModel[]=[]
  items_2:DeliverymanRankByPointViewModel[]=[]
  items_3:DeliverymanRankByPointViewModel[]=[]
  branchesList: SelectItem[]=[];
  areaList: SelectItem[]=[];
  searchViewModel:DeliverymanRankByPointSearchViewModel = new DeliverymanRankByPointSearchViewModel()
  mainPanel: HTMLDivElement;
  constructor(
    private _deliverymanRankByPointService:RankingAgentService,
    private _activatedRoute:ActivatedRoute
  ) {
  }



  ngOnInit() {
    this.initializePage();
  }


  initializePage(){
    this.page.isPageLoaded=true;
    this._activatedRoute.queryParams.subscribe(params => {
      if (params.branch){
        this.searchViewModel.BranchID = +params.branch;
      }
      if (params.date){
        this.searchViewModel.Date = new Date(params.date);
      }
      if (params.fromDate){
        this.searchViewModel.FromDate = new Date(params.fromDate);
      }
      if (params.todate){
        this.searchViewModel.ToDate = new Date(params.toDate);
      }
      this.search();
    });
  }


  search() {
    this.page.isSearching = true;
    this.items = [];
    this.searchViewModel.Date = moment(this.searchViewModel.Date).format('YYYY-MM-DD');
    
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this._deliverymanRankByPointService.get(this.searchViewModel,1, 20).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.items = response.Data.Items as DeliverymanRankByPointViewModel[];
        this.items.forEach(element => {
          element.Stars = Math.floor(element.Stars*10) /10
        });
        this.page.isPageLoaded = false;
         this.items_2= this.items.filter(x=>this.items.indexOf(x) >= 1 &&this.items.indexOf(x) <= 3 )
         this.items_3= this.items.filter(x=>this.items.indexOf(x) >= 4)
      }
    });
  }
  

  printPage() {
    // this.items_3= this.items.filter(x=>this.items.indexOf(x) >= 4 && this.items.indexOf(x) < 10)
    // var oldWindow = window
    // let leaderBoard = document.getElementById('leader-board')
    // let header = document.getElementById('header')
    // let pageEl= document.getElementById('page-el')
    // let cardHeader = header.getElementsByClassName('tab-header')[0]
    // cardHeader.innerHTML = 
    // `
    //   <div class="tab-title">
    //       <div class="title d-flex align-content-center font-16"> 
    //           TOP ${this.items.length} RANKING DELIVERYMEN OF DATE  ${this.searchViewModel.Date}
    //       </div>
    //     </div>
    // `
    // pageEl.innerHTML = ''
    // pageEl.appendChild(leaderBoard)
    window.print();
  }

  getStarsString(stars:number): string {
    if (stars==1||stars==2||stars==3||stars==4||stars==5){
      return stars+'.0'
    }
    else 
    return stars.toString()
  }
}
