
import { Component, OnInit, ViewChild, Input, EventEmitter } from '@angular/core';
import { BranchLocationViewModel } from '../view-models/branch-location.model';
import { LocationViewModel } from '../view-models/location.model';
import { HeatmapService } from '../heatmap.service';
import { ActivatedRoute } from '@angular/router';
import { HeatMapSearchViewModel } from '../view-models/heat-map-search.model';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { SharedService } from 'src/app/service/shared.service';
import { ListService } from 'src/app/service/list.service';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage()
  map: google.maps.Map
  heatmap: google.maps.visualization.HeatmapLayer = new google.maps.visualization.HeatmapLayer();
  points: any[] = []
  markerPoints: any[] = []
  branches: BranchLocationViewModel[] = []
  center: BranchLocationViewModel = new BranchLocationViewModel()
  data: LocationViewModel[] = []
  pontMarker: LocationViewModel[] = []
  pageIndex: number = 0
  infowindow: google.maps.InfoWindow = new google.maps.InfoWindow();
  markers: google.maps.Marker[] = []
  areaList: SelectItem[] = []
  branchList: SelectItem[] = []
  radius: number = 40
  pages: number = 0
  percentage: number = 0;
  advancedSearch:boolean =false
  searchViewModel: HeatMapSearchViewModel = new HeatMapSearchViewModel()
  mapBtns: SelectItem[] = [
    { ID: 1, Name: 'dashboard.points', Selected: false, Url: '' },
    { ID: 2, Name: 'heatmap.title', Selected: true, Url: '' },
    { ID: 3, Name: 'heatmap.change-gradient', Selected: false, Url: '' },
  ]
  constructor(private _heatmapService: HeatmapService,
    private activatedRoute: ActivatedRoute,
    private _sharedService: SharedService,
    private _listService: ListService,
  ) { }


  ngOnInit(): void {
    this.createSearchForm()
    forkJoin([
      this._listService.getBranchList(),
      this._listService.getAreaList()
    ]).subscribe(res => {
      this.branchList = res[0].Data;
      this.areaList = res[1].Data
      this.page.isPageLoaded = true;

    }
    );
    this.activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      this.getData()
    });

  }

  getData() {
    this.page.isSearching = true
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this._heatmapService.getHeatmapData(this.searchViewModel, this.pageIndex).subscribe(res => {
      if (res.Success) {
        this.data = res.Data.Items
        this.pages = res.Data.Pages
        this.page.options.totalItems = res.Data.Records
        this.data.forEach(point => {
          this.points.push({ location: new google.maps.LatLng(point.Latitude, point.Longitude), weight: 3 })
          this.pontMarker.push({ Latitude: point.Latitude, Longitude: point.Longitude, ID: 0 })
        });
        this.percentage = (this.pageIndex / this.pages) * 100
        if (this.pageIndex < this.pages) {
          this.pageIndex += 1
          this.getData();
        }
        else {
          this.getbranches();
          this.page.isSearching = false
        }
      }
    })

  }
  getbranches() {
    this.branches = []
    this._heatmapService.getBranchesLocation(this.searchViewModel).subscribe(res => {
      if (res.Success) {
        this.branches = res.Data
        this.center = this.branches[0]
        this.initMap();
      }
    })
  }
  initMap(): void {
    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      zoom: 12,
      center: { lat: this.center.Latitude, lng: this.center.Longitude },
      mapTypeId: google.maps.MapTypeId.SATELLITE,
    });
    if (this.mapBtns.find(x => x.Selected).ID == 1)
      this.drowPoint()
    else
      this.drawHeatmap()
  }
  drawHeatmap() {
    for (let i = 0; i < this.markerPoints.length; i++) {
      this.markerPoints[i].setMap(null);
    }
    this.markerPoints = [];
    this.heatmap.setMap(null)
    this.map.setMapTypeId(google.maps.MapTypeId.SATELLITE)
    this.map.setZoom(12)
    this.heatmap.setMap(this.map);
    this.heatmap.setData(this.points);
    this.heatmap.set("radius", 40);
    this.drawBranches()
  }

  drowPoint() {
    this.heatmap.setMap(null)
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
    this.map.setMapTypeId(google.maps.MapTypeId.ROADMAP)
    this.map.setZoom(14)
    this.pontMarker.forEach(p => {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(p.Latitude, p.Longitude),
        map: this.map
      })
      marker.addListener('click', () => {
        this.infowindow.close()
        this.infowindow.setContent(`<span class="amp-5 pr-2"><span class="bold c-darkblue">Latitude: </span>${p.Latitude}</span>
                                    <br>
                                    <span class="amp-5 pr-2"><span class="bold c-darkblue">Longitude: </span>${p.Longitude}</span>`);
        this.infowindow.open(this.map, marker);
      }
      );
      this.markerPoints.push(marker)
    })
    this.drawBranches()
  }
  drawBranches() {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];

    this.branches.forEach(branch => {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(branch.Latitude, branch.Longitude),
        map: this.map,
        title: branch.Name
        , icon: {
          path: "M53.2,30.8c0-11.6-8-21.6-18.8-24.4L28,0l-6.4,6.4C10.8,9.2,2.8,19.2,2.8,30.8C2.8,44.7,14.1,56,28,56S53.2,44.7,53.2,30.8z",
          fillColor: "#112A4E",
          fillOpacity: 1,
          anchor: new google.maps.Point(22, 0),
          scale: 1,
        }
      })
      marker.addListener('click', () => {
        this.infowindow.close()
        this.infowindow.setContent(`<span class="amp-5 pr-2">${branch.Name}</span>`);
        this.infowindow.open(this.map, marker);
      }
      );
      this.markers.push(marker)
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(branch.Latitude, branch.Longitude),
        map: this.map,
        title: branch.Name, 
        icon: {
          path: "M38.9,23.1H17.1c-0.6,0-1.1,0.5-1.1,1.1v4.4c0,1.4,0.9,2.6,2.2,3.1v10c0,0.6,0.5,1.1,1.1,1.1h17.5c0.6,0,1.1-0.5,1.1-1.1v-10c1.3-0.5,2.2-1.7,2.2-3.1v-4.4C40,23.6,39.5,23.1,38.9,23.1z M31.3,25.2h2.2v3.3c0,0.6-0.5,1.1-1.1,1.1s-1.1-0.5-1.1-1.1C31.3,28.5,31.3,25.2,31.3,25.2z M26.9,25.2h2.2v3.3c0,0.6-0.5,1.1-1.1,1.1s-1.1-0.5-1.1-1.1V25.2z M22.5,25.2h2.2v3.3c0,0.6-0.5,1.1-1.1,1.1s-1.1-0.5-1.1-1.1V25.2z M19.3,29.6c-0.6,0-1.1-0.5-1.1-1.1v-3.3h2.2v3.3C20.4,29.1,19.9,29.6,19.3,29.6zM30.2,40.5h-4.4v-2.2c0-1.2,1-2.2,2.2-2.2s2.2,1,2.2,2.2C30.2,38.3,30.2,40.5,30.2,40.5z M35.6,40.5h-3.3v-2.2c0-2.4-2-4.4-4.4-4.4s-4.4,2-4.4,4.4v2.2h-3.3v-8.9c0.4-0.1,0.8-0.4,1.1-0.7c1.2,1.1,3.1,1.1,4.4,0c1.2,1.1,3.1,1.1,4.4,0c1.2,1.1,3.1,1.1,4.4,0c0.3,0.3,0.7,0.5,1.1,0.7V40.5z M37.8,28.5c0,0.6-0.5,1.1-1.1,1.1s-1.1-0.5-1.1-1.1v-3.3h2.2C37.8,25.2,37.8,28.5,37.8,28.5zM19.6,21h17.1c0.6,0,1.1-0.5,1.1-1.1s-0.5-1.1-1.1-1.1H19.6c-0.6,0-1.1,0.5-1.1,1.1S19,21,19.6,21z"
          , fillColor: "#FFFFFF",
          fillOpacity: 1,
          anchor: new google.maps.Point(22, 0),
          scale: 1,
        }
      })
      marker.addListener('click', () => {
        this.infowindow.close()
        this.infowindow.setContent(`<span class="amp-5 pr-2">${branch.Name}</span>`);
        this.infowindow.open(this.map, marker);
      }
      );
    })
  }

  toggleHeatmap() {
    this.heatmap.setMap(this.heatmap.getMap() ? null : this.map);
  }
  changeGradient() {
    const gradient = [
      "rgba(0, 255, 255, 0)",
      "rgba(0, 255, 255, 1)",
      "rgba(0, 191, 255, 1)",
      "rgba(0, 127, 255, 1)",
      "rgba(0, 63, 255, 1)",
      "rgba(0, 0, 255, 1)",
      "rgba(0, 0, 223, 1)",
      "rgba(0, 0, 191, 1)",
      "rgba(0, 0, 159, 1)",
      "rgba(0, 0, 127, 1)",
      "rgba(63, 0, 91, 1)",
      "rgba(127, 0, 63, 1)",
      "rgba(191, 0, 31, 1)",
      "rgba(255, 0, 0, 1)",
    ];
    this.heatmap.set("gradient", this.heatmap.get("gradient") ? null : gradient);
  }

  changeRadius(radius: number) {
    this.radius = radius
    this.heatmap.set("radius", radius);
  }
  mapActions(index) {
    this.mapBtns.forEach(element => {
      element.Selected = false
    });
    this.mapBtns[index].Selected = true
    if (index == 0)
      this.drowPoint();
    else if (index == 1)
      this.drawHeatmap();
    else if (index == 2)
      this.changeGradient();
  }
  createSearchForm() {
    // this.searchViewModel.FromDate =moment(this._sharedService.dateService.getFirstDayCurrentMonth()).format('DD/MM/YYYY');
    // this.searchViewModel.ToDate = moment(new Date()).format('DD/MM/YYYY');

    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.searchViewModel.AmountFrom = 10;
    this.page.searchForm = this._sharedService.formBuilder.group({
      AmountFrom: [this.searchViewModel.AmountFrom],
      AmountTo: [this.searchViewModel.AmountTo],
      AreaID: [this.searchViewModel.AreaID],
      BranchID: [this.searchViewModel.BranchID],
      FromDate: [this.searchViewModel.FromDate],
      ToDate: [this.searchViewModel.ToDate]
    });
  }
  onSearchClicked() {
    this.data = [];
    this.points = [];
    this.pontMarker = [];
    this.pages = 0
    this.pageIndex = 0
    this.percentage = 0
    this._sharedService.saveFilteration({
      pageRoute: '/heatmap',
      searchForm: this.page.searchForm,
    });
  }
  getBranchList(id) {
    this.page.searchForm.controls["BranchID"].setValue(null);
    this.branchList = []
    this._listService.getBranchList(id).subscribe(res => {
      if (res.Success)
        this.branchList = res.Data;
    })

  }
 
}
