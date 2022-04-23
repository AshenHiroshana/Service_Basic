import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Purchaseorder} from '../../../../entities/purchaseorder';
import {PurchaseorderService} from '../../../../services/purchaseorder.service';
import {ViewChild} from '@angular/core';
import {Supplier} from '../../../../entities/supplier';
import {DateHelper} from '../../../../shared/date-helper';
import {SupplierService} from '../../../../services/supplier.service';
import {PurchaseorderitemSubFormComponent} from './purchaseorderitem-sub-form/purchaseorderitem-sub-form.component';

@Component({
  selector: 'app-purchaseorder-form',
  templateUrl: './purchaseorder-form.component.html',
  styleUrls: ['./purchaseorder-form.component.scss']
})
export class PurchaseorderFormComponent extends AbstractComponent implements OnInit {

  suppliers: Supplier[] = [];
  @ViewChild(PurchaseorderitemSubFormComponent) purchaseorderitemSubForm: PurchaseorderitemSubFormComponent;

  form = new FormGroup({
    ordereddate: new FormControl(null, [
      Validators.required,
    ]),
    requireddate: new FormControl(null, [
      Validators.required,
    ]),
    supplier: new FormControl(null, [
      Validators.required,
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    purchaseorderitems: new FormControl(),
  });

  get ordereddateField(): FormControl{
    return this.form.controls.ordereddate as FormControl;
  }

  get requireddateField(): FormControl{
    return this.form.controls.requireddate as FormControl;
  }

  get supplierField(): FormControl{
    return this.form.controls.supplier as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get purchaseorderitemsField(): FormControl{
    return this.form.controls.purchaseorderitems as FormControl;
  }

  constructor(
    private supplierService: SupplierService,
    private purchaseorderService: PurchaseorderService,
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
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PURCHASEORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PURCHASEORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PURCHASEORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PURCHASEORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PURCHASEORDER);
  }

  async submit(): Promise<void> {
    this.purchaseorderitemSubForm.resetForm();
    this.purchaseorderitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const purchaseorder: Purchaseorder = new Purchaseorder();
    purchaseorder.ordereddate = DateHelper.getDateAsString(this.ordereddateField.value);
    purchaseorder.requireddate = DateHelper.getDateAsString(this.requireddateField.value);
    purchaseorder.supplier = this.supplierField.value;
    purchaseorder.description = this.descriptionField.value;
    purchaseorder.purchaseorderitemList = this.purchaseorderitemsField.value;
    try{
      const resourceLink: ResourceLink = await this.purchaseorderService.add(purchaseorder);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/purchaseorders/' + resourceLink.id);
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
          if (msg.ordereddate) { this.ordereddateField.setErrors({server: msg.ordereddate}); knownError = true; }
          if (msg.requireddate) { this.requireddateField.setErrors({server: msg.requireddate}); knownError = true; }
          if (msg.supplier) { this.supplierField.setErrors({server: msg.supplier}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.purchaseorderitemList) { this.purchaseorderitemsField.setErrors({server: msg.purchaseorderitemList}); knownError = true; }
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
