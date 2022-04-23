import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Customerreturn} from '../../../../entities/customerreturn';
import {CustomerreturnService} from '../../../../services/customerreturn.service';
import {ViewChild} from '@angular/core';
import {Sale} from '../../../../entities/sale';
import {DateHelper} from '../../../../shared/date-helper';
import {Paymenttype} from '../../../../entities/paymenttype';
import {SaleService} from '../../../../services/sale.service';
import {Paymentstatus} from '../../../../entities/paymentstatus';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {PaymentstatusService} from '../../../../services/paymentstatus.service';
import {CustomerreturnitemSubFormComponent} from './customerreturnitem-sub-form/customerreturnitem-sub-form.component';

@Component({
  selector: 'app-customerreturn-form',
  templateUrl: './customerreturn-form.component.html',
  styleUrls: ['./customerreturn-form.component.scss']
})
export class CustomerreturnFormComponent extends AbstractComponent implements OnInit {

  sales: Sale[] = [];
  paymenttypes: Paymenttype[] = [];
  paymentstatuses: Paymentstatus[] = [];
  @ViewChild(CustomerreturnitemSubFormComponent) customerreturnitemSubForm: CustomerreturnitemSubFormComponent;

  form = new FormGroup({
    sale: new FormControl(null, [
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
    amount: new FormControl(null, [
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
    customerreturnitems: new FormControl(),
  });

  get saleField(): FormControl{
    return this.form.controls.sale as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get reasonField(): FormControl{
    return this.form.controls.reason as FormControl;
  }

  get amountField(): FormControl{
    return this.form.controls.amount as FormControl;
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

  get customerreturnitemsField(): FormControl{
    return this.form.controls.customerreturnitems as FormControl;
  }

  constructor(
    private saleService: SaleService,
    private paymenttypeService: PaymenttypeService,
    private paymentstatusService: PaymentstatusService,
    private customerreturnService: CustomerreturnService,
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

    this.saleService.getAllBasic(new PageRequest()).then((saleDataPage) => {
      this.sales = saleDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMERRETURN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERRETURNS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMERRETURN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMERRETURN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMERRETURN);
  }

  async submit(): Promise<void> {
    this.customerreturnitemSubForm.resetForm();
    this.customerreturnitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const customerreturn: Customerreturn = new Customerreturn();
    customerreturn.sale = this.saleField.value;
    customerreturn.date = DateHelper.getDateAsString(this.dateField.value);
    customerreturn.reason = this.reasonField.value;
    customerreturn.amount = this.amountField.value;
    customerreturn.paymenttype = this.paymenttypeField.value;
    customerreturn.paymentstatus = this.paymentstatusField.value;
    customerreturn.chequeno = this.chequenoField.value;
    customerreturn.chequedate = DateHelper.getDateAsString(this.chequedateField.value);
    customerreturn.chequebank = this.chequebankField.value;
    customerreturn.chequebranch = this.chequebranchField.value;
    customerreturn.description = this.descriptionField.value;
    customerreturn.customerreturnitemList = this.customerreturnitemsField.value;
    try{
      const resourceLink: ResourceLink = await this.customerreturnService.add(customerreturn);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/customerreturns/' + resourceLink.id);
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
          if (msg.sale) { this.saleField.setErrors({server: msg.sale}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.reason) { this.reasonField.setErrors({server: msg.reason}); knownError = true; }
          if (msg.amount) { this.amountField.setErrors({server: msg.amount}); knownError = true; }
          if (msg.paymenttype) { this.paymenttypeField.setErrors({server: msg.paymenttype}); knownError = true; }
          if (msg.paymentstatus) { this.paymentstatusField.setErrors({server: msg.paymentstatus}); knownError = true; }
          if (msg.chequeno) { this.chequenoField.setErrors({server: msg.chequeno}); knownError = true; }
          if (msg.chequedate) { this.chequedateField.setErrors({server: msg.chequedate}); knownError = true; }
          if (msg.chequebank) { this.chequebankField.setErrors({server: msg.chequebank}); knownError = true; }
          if (msg.chequebranch) { this.chequebranchField.setErrors({server: msg.chequebranch}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.customerreturnitemList) { this.customerreturnitemsField.setErrors({server: msg.customerreturnitemList}); knownError = true; }
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
