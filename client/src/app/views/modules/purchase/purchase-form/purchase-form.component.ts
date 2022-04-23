import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Purchase} from '../../../../entities/purchase';
import {PurchaseService} from '../../../../services/purchase.service';
import {ViewChild} from '@angular/core';
import {Supplier} from '../../../../entities/supplier';
import {DateHelper} from '../../../../shared/date-helper';
import {Purchaseorder} from '../../../../entities/purchaseorder';
import {SupplierService} from '../../../../services/supplier.service';
import {PurchaseorderService} from '../../../../services/purchaseorder.service';
import {PurchaseitemSubFormComponent} from './purchaseitem-sub-form/purchaseitem-sub-form.component';

@Component({
  selector: 'app-purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss']
})
export class PurchaseFormComponent extends AbstractComponent implements OnInit {

  suppliers: Supplier[] = [];
  purchaseorders: Purchaseorder[] = [];
  @ViewChild(PurchaseitemSubFormComponent) purchaseitemSubForm: PurchaseitemSubFormComponent;

  form = new FormGroup({
    date: new FormControl(null, [
      Validators.required,
    ]),
    supplier: new FormControl(null, [
      Validators.required,
    ]),
    total: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(99999999),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    purchaseorder: new FormControl(null, [
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    purchaseitems: new FormControl(),
  });

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get supplierField(): FormControl{
    return this.form.controls.supplier as FormControl;
  }

  get totalField(): FormControl{
    return this.form.controls.total as FormControl;
  }

  get purchaseorderField(): FormControl{
    return this.form.controls.purchaseorder as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get purchaseitemsField(): FormControl{
    return this.form.controls.purchaseitems as FormControl;
  }

  constructor(
    private supplierService: SupplierService,
    private purchaseorderService: PurchaseorderService,
    private purchaseService: PurchaseService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

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
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PURCHASE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PURCHASES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PURCHASE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PURCHASE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PURCHASE);
  }

  async submit(): Promise<void> {
    this.purchaseitemSubForm.resetForm();
    this.purchaseitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const purchase: Purchase = new Purchase();
    purchase.date = DateHelper.getDateAsString(this.dateField.value);
    purchase.supplier = this.supplierField.value;
    purchase.total = this.totalField.value;
    purchase.purchaseorder = this.purchaseorderField.value;
    purchase.description = this.descriptionField.value;
    purchase.purchaseitemList = this.purchaseitemsField.value;
    try{
      const resourceLink: ResourceLink = await this.purchaseService.add(purchase);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/purchases/' + resourceLink.id);
      } else {
        this.form.reset();
        this.snackBar.open('Successfully saved', null, {duration: 2000});
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
          if (msg.total) { this.totalField.setErrors({server: msg.total}); knownError = true; }
          if (msg.purchaseorder) { this.purchaseorderField.setErrors({server: msg.purchaseorder}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
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
