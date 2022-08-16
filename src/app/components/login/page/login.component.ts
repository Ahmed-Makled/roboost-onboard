import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LocalizationService } from 'src/app/service/localization.service';
import { CRUDCreatePage } from 'src/app/model/shared/crud-create.model';
import { SharedService } from 'src/app/service/shared.service';
import { TokenService } from 'src/app/service/token.service';
import { LoginService } from '../login.service';
import { LogInViewModel } from '../view-models/login.model';
import { LanguageTypeEnum } from '../../logged-user/view-model/logged-user.model';
import { LoggedUserService } from '../../logged-user/logged-user.service';
import { StorageService } from 'src/app/service/storage.service';
import { callbackify } from 'util';
import { environment } from 'src/environments/environment';
import { CSSFilesService } from 'src/app/service/cssFiles.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  page: CRUDCreatePage = new CRUDCreatePage();
  model: LogInViewModel = new LogInViewModel();
  invalidUser: boolean = false;
  logo: string;
  fieldTextType: boolean;
  lang:string;
  constructor(
    private _sharedService: SharedService,
    private _tokenService: TokenService,
    private _loginService: LoginService,
    private _localizationService: LocalizationService,
    private _userService: LoggedUserService,
    private _CSSFilesService:CSSFilesService,
  ) {
   }
  ngOnInit(): void {
    this.lang=this._localizationService.getCurrentLanguage();
    this._CSSFilesService.changeStyle()
    this.createForm()
  }

  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      UserName: ['', [Validators.required]],
      Password: ['', [Validators.required]],
      Language:[this.lang]
    });
    this.page.isPageLoaded = true;
    loadJsFiles('/assets/js/login-animation.js');
  }
  enterEvent(event) {
    if (event.key == 'Enter' && !this.disabledSubmit()) {
      this.login();
    }
  }

  auth(callback) {
    this._loginService.auth(this.page.form.value).subscribe((res) => {
      if (res.Success) {
        this._sharedService._storageService.setApi(res.Data.CompanyAPI)
        callback()
      }
      else {
        this.invalidUser = true;
      }
      this.page.isSaving = false;
    }, (err) => {
      this.page.isSaving = false;
    });
  }
  
  login() {
    this.page.isSaving = true;
    let loginLanguage = this.lang == "ar" ? LanguageTypeEnum.AR : LanguageTypeEnum.EN;
    this.page.form.controls.Language.setValue(loginLanguage);

    if(environment.allowDynamicApi){
      this.auth(()=>{
        this.loginReqest()
      })
    }
    else this.loginReqest()
  }

  loginReqest() { 
    this._loginService.login(this.page.form.value).subscribe(
      (res) => {
        if (res.Success) {
          let response = res.Data as LogInViewModel;
          this._tokenService.setToken(response.Troken);
          this._sharedService._storageService.setISSingleStore(JSON.stringify(!response.IsAllowMultiBranch))
          localStorage.setItem("roles", JSON.stringify(this.model.Role));
          this._localizationService.setLanguage(response.Language == LanguageTypeEnum.AR ? 'ar' : 'en')
          this._sharedService._storageService.setUserPages(response.AllowedPages)
          this._sharedService.router.navigate([response.RedirectUrl])
        }
        else {
          this.invalidUser = true;
        }
        this.page.isSaving = false;
      }, (err) => {
        this.page.isSaving = false;
      }
    );
  }

  disabledSubmit() {
    return this.page.isSaving;
  }
  toggleLang(){
    this.lang = this.lang =='ar'? 'en':'ar'
    this._localizationService.setLanguage( this.lang );
    window.location.reload()
  }
}
function loadJsFiles(url) {
  let node = document.createElement('script');
  node.src = url;
  node.type = 'text/javascript';
  node.async = true;
  node.charset = 'utf-8';
  document.getElementsByTagName('head')[0].appendChild(node);
}
