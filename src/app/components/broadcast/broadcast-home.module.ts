import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './home/index/index.component';
import { SharedModule } from '../shared/shared.module';
import { BroadcastDetailsComponent } from './details/details.component';

export const routes: Routes = [
  {path:'',component:IndexComponent},
  {path:'details/:code',component:BroadcastDetailsComponent}

  
]

@NgModule({
  declarations: [IndexComponent, BroadcastDetailsComponent],
  imports: [
    CommonModule,RouterModule.forChild(routes),SharedModule
  ]
})
export class BroadCastModule { }
