import { Injectable } from '@angular/core';
import { ApplicationRole } from '../enum/application-role';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  tokenStorageName: string = "userToken";
  roleStorageName: string = "userRole";
  
  constructor() { }

  setToken(token: string) {
    localStorage.setItem(this.tokenStorageName, token);
  }

  getToken() {
    let token: string = localStorage.getItem(this.tokenStorageName);
    // alert("token"+token)
    if (token == null || token == 'undefined') {
      return "";
    }
    return token;
  }

  hasAccessToken(): boolean {
    return (localStorage.getItem(this.tokenStorageName) != null && localStorage.getItem(this.tokenStorageName).length > 0)
  }
  removeToken() {
    localStorage.setItem(this.tokenStorageName, null);
    localStorage.removeItem(this.tokenStorageName);
  }




  setRole(value: ApplicationRole) {
    localStorage.setItem(this.roleStorageName, value.toString());
  }

  getRole() :string{
    let role: string = localStorage.getItem(this.roleStorageName);
    if (role == null || role == 'undefined') {return "";}
    return role;
  }

  removeRole() {
    localStorage.setItem(this.roleStorageName, "");
    localStorage.removeItem(this.roleStorageName);
  }

  clearUserData(){
    this.removeToken()
    this.removeRole()
  }

  isAuthenticated(): boolean {
    return this.hasAccessToken(); 
  
  }

  isAuthorized(roles:ApplicationRole[]): boolean {
    if(roles&&roles.length>0)
    return this.getRole() !="" && roles.some(i=>i == +this.getRole())
    else return true
  }


}
