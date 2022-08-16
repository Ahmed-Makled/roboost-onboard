import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  constructor(private translate: TranslateService) { }

  setLanguage(lang: string) {
    // this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    localStorage.setItem("lang", lang.toLowerCase());
  }

  hasLanguage() {
    let lang: string = localStorage.getItem("lang");
    return (lang != null && lang.length > 0 && lang != 'undefined')
  }

  getLanguage():string {
    let lang: string = localStorage.getItem("lang");
    if (! this.hasLanguage()) {
      return this.getDefaultLanguage();
    }
    return lang;
  }
  getCurrentLanguage():string {
    return this.translate.currentLang;;
  }
  private getDefaultLanguage() {
    return "en";
  }
}
