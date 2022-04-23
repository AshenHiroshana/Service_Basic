import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Supplierreturn} from '../../../../entities/supplierreturn';
import {SupplierreturnService} from '../../../../services/supplierreturn.service';
import {ViewChild} from '@angular/core';
import {Supplier} from '../../../../entities/supplier';
import {DateHelper} from '../../../../shared/date-helper';
import {Paymenttype} from '../../../../entities/paymenttype';
import {Paymentstatus} from '../../../../entities/paymentstatus';
import {SupplierService} from '../../../../services/supplier.service';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {PaymentstatusService} from '../../../../services/paymentstatus.service';
import {SupplierreturnitemSubFormComponent} from './supplierreturnitem-sub-form/supplierreturnitem-sub-form.component';

@Component({
  selector: 'app-supplierreturn-form',
  templateUrl: './supplierreturn-form.component.html',
  styleUrls: ['./supplierreturn-form.component.scss']
})
export class SupplierreturnFormComponent extends AbstractComponent implements OnInit {

  suppliers: Supplier[] = [];
  paymenttypes: Paymenttype[] = [];
  paymentstatuses: Paymentstatus[] = [];
  @ViewChild(SupplierreturnitemSubFormComponent) supplierreturnitemSubForm: SupplierreturnitemSubFormComponent;

  form = new FormGroup({
    supplier: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    reason: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    returnedamount: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(99999999),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    paymenttype: new FormControl(null, [
      Validators.required,
    ]),
    paymentstatus: new FormControl(null, [
      Validators.required,
    ]),
    chequeno: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    chequedate: new FormControl(null, [
      Validators.required,
    ]),
    chequebank: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    chequebranch: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    supplierreturnitems: new FormControl(),
  });

  get supplierField(): FormControl{
    return this.form.controls.supplier as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get reasonField(): FormControl{
    return this.form.controls.reason as FormControl;
  }

  get returnedamountField(): FormControl{
    return this.form.controls.returnedamount as FormControl;
  }

  get paymenttypeField(): FormControl{
    return this.form.controls.paymenttype as FormControl;
  }

  get paymentstatusField(): FormControl{
    return this.form.controls.paymentstatus as FormControl;
  }

  get chequenoField(): FormControl{
    return this.form.controls.chequeno as FormControl;
  }

  get chequedateField(): FormControl{
    return this.form.controls.chequedate as FormControl;
  }

  get chequebankField(): FormControl{
    return this.form.controls.chequebank as FormControl;
  }

  get chequebranchField(): FormControl{
    return this.form.controls.chequebranch as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get supplierreturnitemsField(): FormControl{
    return this.form.controls.supplierreturnitems as FormControl;
  }

  constructor(
    private supplierService: SupplierService,
    private paymenttypeService: PaymenttypeService,
    private paymentstatusService: PaymentstatusService,
    private supplierreturnService: SupplierreturnService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.paymenttypeService.getAll().then((paymenttypes) => {
      this.paymenttypes = paymenttypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.paymentstatusService.getAll().then((paymentstatuses) => {
      this.paymentstatuses = paymentstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIERRETURN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SUPPLIERRETURNS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SUPPLIERRETURN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIERRETURN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIERRETURN);
  }

  async submit(): Promise<void> {
    this.supplierreturnitemSubForm.resetForm();
    this.supplierreturnitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const supplierreturn: Supplierreturn = new Supplierreturn();
    supplierreturn.supplier = this.supplierField.value;
    supplierreturn.date = DateHelper.getDateAsString(this.dateField.value);
    supplierreturn.reason = this.reasonField.value;
    supplierreturn.returnedamount = this.returnedamountField.value;
    supplierreturn.paymenttype = this.paymenttypeField.value;
    supplierreturn.paymentstatus = this.paymentstatusField.value;
    supplierreturn.chequeno = this.chequenoField.value;
    supplierreturn.chequedate = DateHelper.getDateAsString(this.chequedateField.value);
    supplierreturn.chequebank = this.chequebankField.value;
    supplierreturn.chequebranch = this.chequebranchField.value;
    supplierreturn.description = this.descriptionField.value;
    supplierreturn.supplierreturnitemList = this.supplierreturnitemsField.value;
    try{
      const resourceLink: ResourceLink = await this.supplierreturnService.add(supplierreturn);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/supplierreturns/' + resourceLink.id);
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
          if (msg.supplier) { this.supplierField.setErrors({server: msg.supplier}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.reason) { this.reasonField.setErrors({server: msg.reason}); knownError = true; }
          if (msg.returnedamount) { this.returnedamountField.setErrors({server: msg.returnedamount}); knownError = true; }
          if (msg.paymenttype) { this.paymenttypeField.setErrors({server: msg.paymenttype}); knownError = true; }
          if (msg.paymentstatus) { this.paymentstatusField.setErrors({server: msg.paymentstatus}); knownError = true; }
          if (msg.chequeno) { this.chequenoField.setErrors({server: msg.chequeno}); knownError = true; }
          if (msg.chequedate) { this.chequedateField.setErrors({server: msg.chequedate}); knownError = true; }
          if (msg.chequebank) { this.chequebankField.setErrors({server: msg.chequebank}); knownError = true; }
          if (msg.chequebranch) { this.chequebranchField.setErrors({server: msg.chequebranch}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.supplierreturnitemList) { this.supplierreturnitemsField.setErrors({server: msg.supplierreturnitemList}); knownError = true; }
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
