import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CustomerReviewComponent } from './index/customer-review.component';

export const routes: Routes = [
  { path: '', component: CustomerReviewComponent },

]

@NgModule({
  declarations: [CustomerReviewComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes), SharedModule
  ]
})
export class CustomerReviewModule { }
