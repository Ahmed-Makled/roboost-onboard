import {  GuidedTourTestService } from './guided-tour.service';
import { NgModule, ErrorHandler, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowRefTestService } from './windowref.service';
import { GuidedTourCustomComponent } from './guided-tour.component';

@NgModule({
  declarations: [GuidedTourCustomComponent],
  imports: [CommonModule],
  providers: [WindowRefTestService],
  exports: [GuidedTourCustomComponent],
  entryComponents: [GuidedTourCustomComponent],
})
export class GuidedTourCustomModule {
  public static forRoot(): ModuleWithProviders<GuidedTourCustomModule> {
    return {
      ngModule: GuidedTourCustomModule,
      providers: [ErrorHandler, GuidedTourTestService],
    };
  }
}
