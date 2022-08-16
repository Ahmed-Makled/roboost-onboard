import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { UserProfileService } from '../user-profile.service';
import { UserMainInfoViewModel } from '../view-models/user-main-info.model';
import { EditRoleViewModel } from '../view-models/user-role.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApplicationRole } from 'src/app/enum/application-role';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { SharedService } from 'src/app/service/shared.service';
import { ListService } from 'src/app/service/list.service';
import { FeatureEnum } from 'src/app/enum/feature.enum';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']

})

export class IndexComponent implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  userID: number = 0
  editRole: EditRoleViewModel = new EditRoleViewModel()
  mainInfo: UserMainInfoViewModel = new UserMainInfoViewModel()
  roles: SelectItem[] = [];
  modalRef: BsModalRef;
  branchList: SelectItem[] = [];
  roleList: SelectItem[] = [];
  selectedRole: number
  @ViewChild('chooseRoleTemplate', { static: false }) chooseRoleTemplate: any;
  @ViewChild('reserPasswordConfirmationTemplate', { static: false }) reserPasswordConfirmationTemplate: any;
  @ViewChild('viewPasswordTemplate', { static: false }) viewPasswordTemplate: any;
  password: string;
  generatedPassword: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _userProfileService: UserProfileService,
    private _listService: ListService,
    public _sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.initializePage()
  }

  initializePage() {
    this.page.isPageLoaded = false;
    this.activatedRoute.params.subscribe(params => {
      this.userID = params['id']
    })
    forkJoin([
      this._userProfileService.getMainInfo(this.userID),
      this._listService.getBranchList()
    ]).subscribe(res => {
      this.mainInfo = res[0].Data
      this.branchList = res[1].Data
      this.page.isLoading = true;
    });
  }

  save() {
    this.editRole.BranchesIDs = this.editRole.RoleID == ApplicationRole.ADMIN || this.editRole.RoleID == ApplicationRole.MARKETING_MANAGER ? [] : this.branchList.filter(i => i.Selected == true).map(x => x.ID)
    this.editRole.RoleID = this.isEditBranch ? this.mainInfo.RoleID : this.selectedRole
    this.editRole.UserID = this.userID
    this._userProfileService.editRole(this.editRole).subscribe(res => {
      this._sharedService.showToastr(res);
      if (res.Success) {
        this.mainInfo.RoleName = this.roles.find(i => i.ID == this.editRole.RoleID).Name
        this.mainInfo.Branches = this.branchList.filter(i => i.Selected == true)
        this.mainInfo.RoleID = this.editRole.RoleID
      }
    })
  }

  isEditBranch: boolean = false
  showSelectRole(EditBranch: boolean = false): void {
    this.roleList = []
    if (EditBranch) {
      this.isEditBranch = true
      this.selectedRole = this.mainInfo.RoleID
      this.onRoleChange()
      this.branchList.filter(i => this.mainInfo.Branches.some(x => x.ID == i.ID)).forEach(x => x.Selected = true)
      this.modalRef = this._sharedService.modalService.show(this.chooseRoleTemplate, { class: 'modal-500' })
    }
    else {
      this.selectedRole = null
      this.isEditBranch = false
      this.branchList.filter(i => i.Selected == true).forEach(x => x.Selected = false)
      this._listService.getRoleList().subscribe(res => {
        if (res.Success) {
          this.roles = res.Data as SelectItem[]
          this.roles.forEach(element => {
            if (this.mainInfo.RoleID != element.ID && element.ID != ApplicationRole.DELIVERYMAN)
              this.roleList.push(element)
          });
          this.modalRef = this._sharedService.modalService.show(this.chooseRoleTemplate, { class: 'modal-500' })
        }
      })
    }
  }

  isAdminRole(): boolean {
    return this.mainInfo.RoleID == ApplicationRole.ADMIN;
  }
  isMarketingRole(): boolean {
    return this.mainInfo.RoleID == ApplicationRole.MARKETING_MANAGER;
  }
  isAdminSelect(): boolean {
    return this.selectedRole == ApplicationRole.ADMIN;
  }
  isMarketingSelect(): boolean {
    return this.selectedRole == ApplicationRole.MARKETING_MANAGER;
  }
  showResetPaswwordConfirmationTemplate() {
    this.modalRef = this._sharedService.modalService.show(this.reserPasswordConfirmationTemplate, { class: 'modal-md' });
  }

  generateRandomPassword() {
    var passwordLength = 12;
    var addUpper = true;
    var addNumbers = true;
    var addSymbols = true;
    var lowerCharacters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    var upperCharacters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var symbols = ['!', '?', '@'];
    var getRandom = function (array) {
      return array[Math.floor(Math.random() * array.length)];
    }
    var finalCharacters = "";
    if (addUpper) {
      finalCharacters = finalCharacters.concat(getRandom(upperCharacters));
    }
    if (addNumbers) {
      finalCharacters = finalCharacters.concat(getRandom(numbers));
    }
    if (addSymbols) {
      finalCharacters = finalCharacters.concat(getRandom(symbols));
    }
    for (var i = 1; i < passwordLength - 3; i++) {
      finalCharacters = finalCharacters.concat(getRandom(lowerCharacters));
    }
    //shuffle!
    return finalCharacters.split('').sort(function () {
      return 0.5 - Math.random()
    }).join('');
  }

  showResetPasswordConfirm() {
    this.generatedPassword = "";
    this.modalRef = this._sharedService.modalService.show(this.viewPasswordTemplate, { class: 'modal-md' });
  }

  resetPassword() {
    this.page.isSaving = true
    this._userProfileService.resetPassword(this.userID, this.generatedPassword).subscribe(res => {
      this.page.isSaving = false
      if (res.Success) {
        this.password = res.Data
        this._sharedService.showSuccessAlert("Sucessfull Update")
      }
    })
  }

  generateRandomPasswordButton() {
    this.generatedPassword = this.generateRandomPassword();
  }

  onRoleChange() {
    this.branchList.forEach(element => {
      if (this.selectedRole == ApplicationRole.ADMIN || this.selectedRole == ApplicationRole.MARKETING_MANAGER)
        element.Selected = true
      else element.Selected = false
    });

  }

  selectStore(item: SelectItem) {
    if ((this.selectedRole == ApplicationRole.ADMIN || this.selectedRole == ApplicationRole.MARKETING_MANAGER)) return;
    if (this.singleSelectStore()) {
      this.branchList.forEach(element => {
        element.Selected = false
      });
      item.Selected = true
    }
    else item.Selected = !item.Selected
  }

  
  singleSelectStore(): boolean {
    return this.selectedRole == ApplicationRole.BRANCH_MANAGER || this.selectedRole == ApplicationRole.OPERATOR
  }
  disableBtnEditRole(): boolean {
    return this.branchList.filter(i => i.Selected == true).length == 0 || this.selectedRole == null || this.selectedRole == 0
  }

  featureEnum = FeatureEnum
  hasFeature(value: FeatureEnum) {
    return SharedService.featureList.some(i => i == value)
  }
}
