import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Purchase} from '../../../../entities/purchase';
import {PurchaseService} from '../../../../services/purchase.service';
import {ViewChild} from '@angular/core';
import {Supplier} from '../../../../entities/supplier';
import {DateHelper} from '../../../../shared/date-helper';
import {Purchaseorder} from '../../../../entities/purchaseorder';
import {Purchasestatus} from '../../../../entities/purchasestatus';
import {SupplierService} from '../../../../services/supplier.service';
import {PurchaseorderService} from '../../../../services/purchaseorder.service';
import {PurchasestatusService} from '../../../../services/purchasestatus.service';
import {PurchaseitemUpdateSubFormComponent} from './purchaseitem-update-sub-form/purchaseitem-update-sub-form.component';

@Component({
  selector: 'app-purchase-update-form',
  templateUrl: './purchase-update-form.component.html',
  styleUrls: ['./purchase-update-form.component.scss']
})
export class PurchaseUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  purchase: Purchase;

  suppliers: Supplier[] = [];
  purchaseorders: Purchaseorder[] = [];
  purchasestatuses: Purchasestatus[] = [];
  @ViewChild(PurchaseitemUpdateSubFormComponent) purchaseitemUpdateSubForm: PurchaseitemUpdateSubFormComponent;

  form = new FormGroup({
    date: new FormControl(null, [
      Validators.required,
    ]),
    supplier: new FormControl(null, [
      Validators.required,
    ]),
    purchaseorder: new FormControl(null, [
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    purchasestatus: new FormControl('1', [
      Validators.required,
    ]),
    purchaseitems: new FormControl(),
  });

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get supplierField(): FormControl{
    return this.form.controls.supplier as FormControl;
  }

  get purchaseorderField(): FormControl{
    return this.form.controls.purchaseorder as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get purchasestatusField(): FormControl{
    return this.form.controls.purchasestatus as FormControl;
  }

  get purchaseitemsField(): FormControl{
    return this.form.controls.purchaseitems as FormControl;
  }

  constructor(
    private supplierService: SupplierService,
    private purchaseorderService: PurchaseorderService,
    private purchasestatusService: PurchasestatusService,
    private purchaseService: PurchaseService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.supplierService.getAllBasic(new PageRequest()).then((supplierDataPage) => {
      this.suppliers = supplierDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.purchaseorderService.getAllBasic(new PageRequest()).then((purchaseorderDataPage) => {
      this.purchaseorders = purchaseorderDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.purchasestatusService.getAll().then((purchasestatuses) => {
      this.purchasestatuses = purchasestatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.purchase = await this.purchaseService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PURCHASE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PURCHASES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PURCHASE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PURCHASE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PURCHASE);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.dateField.pristine) {
      this.dateField.setValue(this.purchase.date);
    }
    if (this.supplierField.pristine) {
      this.supplierField.setValue(this.purchase.supplier.id);
    }
    if (this.purchaseorderField.pristine) {
      this.purchaseorderField.setValue(this.purchase.purchaseorder.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.purchase.description);
    }
    if (this.purchasestatusField.pristine) {
      this.purchasestatusField.setValue(this.purchase.purchasestatus.id);
    }
    if (this.purchaseitemsField.pristine) {
      this.purchaseitemsField.setValue(this.purchase.purchaseitemList);
    }
}

  async submit(): Promise<void> {
    this.purchaseitemUpdateSubForm.resetForm();
    this.purchaseitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newpurchase: Purchase = new Purchase();
    newpurchase.date = DateHelper.getDateAsString(this.dateField.value);
    newpurchase.supplier = this.supplierField.value;
    newpurchase.purchaseorder = this.purchaseorderField.value;
    newpurchase.description = this.descriptionField.value;
    newpurchase.purchasestatus = this.purchasestatusField.value;
    newpurchase.purchaseitemList = this.purchaseitemsField.value;
    try{
      const resourceLink: ResourceLink = await this.purchaseService.update(this.selectedId, newpurchase);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/purchases/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/purchases');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.supplier) { this.supplierField.setErrors({server: msg.supplier}); knownError = true; }
          if (msg.purchaseorder) { this.purchaseorderField.setErrors({server: msg.purchaseorder}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.purchasestatus) { this.purchasestatusField.setErrors({server: msg.purchasestatus}); knownError = true; }
          if (msg.purchaseitemList) { this.purchaseitemsField.setErrors({server: msg.purchaseitemList}); knownError = true; }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }
}
