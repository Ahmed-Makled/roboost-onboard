import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShippingAddressComponent } from './index/shipping-address.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

export const routes: Routes = [
  { path: '', component: ShippingAddressComponent },

]

@NgModule({
  declarations: [ShippingAddressComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes), SharedModule
  ]
})
export class ShippingAddressModule { }
