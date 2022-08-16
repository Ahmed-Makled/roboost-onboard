
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Validators } from '@angular/forms';
import { OrderBranchConfigurationViewModel } from '../view-models/order-branch-configuration.model';
import { BranchProfileService } from '../../../branch-profile.service';
import { ActivatedRoute } from '@angular/router';
import { CRUDCreatePage } from 'src/app/model/shared/crud-create.model';
import { SharedService } from 'src/app/service/shared.service';
import { Patterns } from 'src/app/pattern/patterns';



@Component({
  selector: 'order-confg',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class OrderConfigurationComponent implements OnInit {
  
  
  modalRef: BsModalRef;

  constructor(
    private _orderBranchConfiguratioService: BranchProfileService,
    public _sharedService: SharedService,
    private activatedRoute :ActivatedRoute
  ) { }
  page:CRUDCreatePage=new CRUDCreatePage();
  model: OrderBranchConfigurationViewModel = new OrderBranchConfigurationViewModel();
  createForm() {
   
    this.page.form = this._sharedService.formBuilder.group({
      ID: [this.model.ID, [Validators.required]],
      MaxWaitingTime: [this.model.MaxWaitingTime, [Validators.required,Validators.pattern(Patterns.OnlyNumbers)]],
      MinWaitingTime: [this.model.MinWaitingTime, [Validators.required,Validators.pattern(Patterns.OnlyNumbers) ]],
      OrderCloseDistance: [this.model.OrderCloseDistance, [Validators.required, Validators.pattern(Patterns.OnlyNumbers)]],
      OrderFarDistance: [this.model.OrderFarDistance, [Validators.required ,Validators.pattern(Patterns.OnlyNumbers)]],
      OrderNormalTime: [this.model.OrderNormalTime, [Validators.required,Validators.pattern(Patterns.OnlyNumbers) ]],
      OrderReadyTime: [this.model.OrderReadyTime, [Validators.required, Validators.pattern(Patterns.OnlyNumbers)]],
      OrderServiceTime: [this.model.OrderServiceTime, [Validators.required, Validators.pattern(Patterns.OnlyNumbers)]],
      OrderTopUrgentTime: [this.model.OrderTopUrgentTime, [Validators.required, Validators.pattern(Patterns.OnlyNumbers)]],
      OrderUrgentTime: [this.model.OrderUrgentTime, [Validators.required,Validators.pattern(Patterns.OnlyNumbers) ]],
      OrderWithinRangeDistance: [this.model.OrderWithinRangeDistance, [Validators.required, Validators.pattern(Patterns.OnlyNumbers)]],
      PreparationTime: [this.model.PreparationTime, [Validators.required, Validators.pattern(Patterns.OnlyNumbers)]],
      CloseToBranchDistance: [this.model.CloseToBranchDistance, [Validators.required,Validators.pattern(Patterns.OnlyNumbers)]],
    })
    this.page.isPageLoaded= true;
  }

  
  ngOnInit() {
    this.createForm()
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      this._orderBranchConfiguratioService.getLastOrderConfiguration(id).subscribe(res=>{
        if(res.Success)
        {
         this.model = res.Data[0]
         this.createForm()
        }
      })
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
   save() {
     //alert("save");
     this.page.isSaving = true;
     Object.assign(this.model, this.page.form.value);
     this._orderBranchConfiguratioService.updateOrderConfiguration(this.model).subscribe(response => {
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
 

  

  
  }

