import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OrderByDateComponent } from './by-date.component';
import { SharedModule } from 'src/app/components/shared/shared.module';

export const routes: Routes = [
  { path: '', component:OrderByDateComponent  },

]

@NgModule({
  declarations: [
    OrderByDateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), SharedModule
  ],
})

export class OrderPerformanceDateModule { }
