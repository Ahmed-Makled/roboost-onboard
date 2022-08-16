import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './routing/app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule, registerLocaleData } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { NgProgressHttpModule } from "ngx-progressbar/http";
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ChartModule } from 'angular-highcharts';
import { NgProgressModule } from 'ngx-progressbar';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from './components/shared/shared.module';
import { AgmOverlays } from 'agm-overlays';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import localeAr from '@angular/common/locales/ar-EG';
import { GuidedTourTestService } from './lib/guided-tour.service';

registerLocaleData(localeAr)


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    ToastrModule.forRoot({}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgProgressModule.withConfig({
      spinnerPosition: "right",
      color: "#f71cff"
    }),
    NgProgressHttpModule,NgxSkeletonLoaderModule.forRoot(),
    ChartModule,AgmOverlays,NgxMaterialTimepickerModule,
  ],
  providers: [TranslateService,GuidedTourTestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
