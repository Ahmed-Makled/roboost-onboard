import { Component, OnInit, Input,  } from '@angular/core';
import { MouseEvent as AGMMouseEvent } from '@agm/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CustomerLocationViewModel } from '../view-models/customer-location.model';
import { BranchViewModel } from '../view-models/branch-location.model';
import { environment } from 'src/environments/environment';
import { CRUDCreatePage } from 'src/app/model/shared/crud-create.model';
import { SharedService } from 'src/app/service/shared.service';
import { MapLocation } from 'src/app/components/shared/component/map/view-models/Map.model';
import { CallCenterService } from '../../../call-center.service';
@Component({
  selector: 'branches',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class BranchesComponent implements OnInit {
  modalRef: BsModalRef;
  location:MapLocation=new MapLocation();
  zoom = 14;
  page:CRUDCreatePage=new CRUDCreatePage();
  model: CustomerLocationViewModel = new CustomerLocationViewModel();
  lastBranch :BranchViewModel =new BranchViewModel;
  closestBranch :BranchViewModel[]=[]
  showMap : boolean= true
  @Input() phoneSearch:string;
  constructor(
    public _sharedService: SharedService,
    private activatedRoute:ActivatedRoute,
    private _customerProfileService:CallCenterService
  ) { }
  ngOnChanges(): void {
    if(!environment.production){
      this.showMap = false
    }
    var id
    this.activatedRoute.params.subscribe(params => {
      id = params['id']
    })
    forkJoin([
      this._customerProfileService.getCustomerBranches(id,this.phoneSearch)
    ]).subscribe(res => {
      if(res[0].Success  && res[0].Data !=null){
        this.model = res[0].Data
        if(this.model)        {
        this.model.Branches.forEach(element => {
          element.Distance = Math.floor(element.Distance*1000)
        });
        this.lastBranch = this.model.Branches.find(x=>x.ID == this.model.BranchID)
        this.model.Branches.splice(this.model.Branches.length-1 , 1)
      }
    }
    }
    );
  }
  ngOnInit() {
   }
  onMapClick($event:AGMMouseEvent ) {
    // this.model.Latitude = $event.coords.lat,  
    // this.model.Longitude = $event.coords.lng  
    // this.getAddress()
  }
  // mapsAPILoader
  // getCurrentLocation() {
  //   this.mapsAPILoader.load().then(() => {
  //     let geocoder = new google.maps.Geocoder;
  //     let latlng = {lat: this.model.Latitude, lng: this.model.Longitude};
  //     let that = this;
  //     geocoder.geocode({'location': latlng}, function(results) {
  //         if (results[0]) {
  //           that.zoom = 11;
  //           that.model.Address = results[0].formatted_address;
  //           //// console.log(that.currentLocation);
  //         } else {
  //           // console.log('No results found');
  //         }
  //     });
  //   });
  // }
  // getAddress() {
  //   this.geoCoder.geocode({ 'location': { lat: this.model.Latitude, lng: this.model.Longitude } }, (results, status) => {
  //     // console.log(results);
  //     // console.log(status);
  //     if (status === 'OK') {
  //       if (results[0]) {
  //         this.zoom = 12;
  //         this.model.Address = results[0].formatted_address;
  //       } else {
  //         window.alert('No results found');
  //       }
  //     } else {
  //       window.alert('Geocoder failed due to: ' + status);
  //     }
  //   });
  // }
  //  addMarker(lat: number, lng: number) {
  //   this.location.markers.splice(0, 1);
  //   this.location.markers.push({ lat, lng });
  // }
}
