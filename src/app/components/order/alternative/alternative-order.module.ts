import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { IndexComponent } from './index/index.component';



export const routes: Routes = [
  {path:':id',component:IndexComponent},
 
]
@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),SharedModule

  ]
})
export class AlternativeOrderModule { }
