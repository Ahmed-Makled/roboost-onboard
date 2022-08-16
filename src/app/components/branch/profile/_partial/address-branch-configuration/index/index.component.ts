
import { Component, OnInit } from '@angular/core';
import { MouseEvent as AGMMouseEvent } from '@agm/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Validators } from '@angular/forms';
import { AddressBranchConfigurationViewModel } from '../view-models/address-branch-configuration.model';
import { BranchProfileService } from '../../../branch-profile.service';
import { ActivatedRoute } from '@angular/router';
import { MapLocation } from 'src/app/components/shared/component/map/view-models/Map.model';
import { CRUDCreatePage } from 'src/app/model/shared/crud-create.model';
import { SharedService } from 'src/app/service/shared.service';
@Component({
  selector: 'address-confg',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class AddressConfigurationComponent implements OnInit {

  
  modalRef: BsModalRef;
  location:MapLocation=new MapLocation();
  zoom = 15;
  // private geoCoder
  page:CRUDCreatePage=new CRUDCreatePage();
  model: AddressBranchConfigurationViewModel = new AddressBranchConfigurationViewModel();
  constructor(
    private _addressBranchConfiguratioService: BranchProfileService,
    public _sharedService: SharedService,
    private activatedRoute:ActivatedRoute
  ) { }

  ngOnInit() {
    this.createForm()
    // this.initializePage();
    // this.geoCoder = new google.maps.Geocoder();
    var id
    this.activatedRoute.params.subscribe(params => {
      id = params['id']
    })

    this._addressBranchConfiguratioService.getLastAddressConfiguration(id).subscribe(res=>{
      if (res.Success) {
        this.model = res.Data
        this.createForm()
        
      }
    })
   }
  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      ID: [this.model.ID, [Validators.required]],
      Latitude: [this.model.Latitude, [Validators.required]],
      Longitude: [this.model.Longitude, [Validators.required]],
      AddressPrefix: [this.model.AddressPrefix],
      Address: [this.model.Address, ],

     })
    this.page.isPageLoaded= true;
  }


  

  onMapClick($event:AGMMouseEvent ) {
    this.model.Latitude = $event.coords.lat,  
    this.model.Longitude = $event.coords.lng  
    this.page.form = this._sharedService.formBuilder.group({
      ID: [this.model.ID, [Validators.required]],
      Latitude: [this.model.Latitude, [Validators.required]],
      Longitude: [this.model.Longitude, [Validators.required]],
      AddressPrefix: [this.model.AddressPrefix ],
      Address: [this.model.Address ],

     })
    
  }
  
  isControlNotValidAndTouched(controlName:string)
  {
    let control=this.page.form.controls[controlName];
    return control.invalid && control.touched;
  }
  
  isControlValidAndDirty(controlName:string)
  {
    let control=this.page.form.controls[controlName];
    return control.valid && control.dirty;
  }
  
  isControlNotValidAndDirty(controlName:string)
  {
    let control=this.page.form.controls[controlName];
    return !control.valid && control.dirty;
  }
  
  isControlHasError(controlName:string, error:string)
  {
    return this.page.form.controls[controlName].hasError(error);
  }
  disabledSubmit() {
    return this.page.isSaving || this.page.isUploading || !this.page.form.valid;
  }
   edit(){
    this.page.isSaving = false;
   }
   save() {
     Object.assign(this.model, this.page.form.value);
     this._addressBranchConfiguratioService.updateAddressConfiguration(this.model).subscribe(response => {
     this.page.isSaving = false;
       this.page.responseViewModel = response;
       this._sharedService.showToastr(response);
       //alert(this.page.responseViewModel.Message);
       if (response.Success) {

     }})
   }

   get controls() {
     return this.page.form.controls;
   }

   addMarker(lat: number, lng: number) {
    this.location.markers.splice(0, 1);
    this.location.markers.push({ lat, lng });
  }

}

