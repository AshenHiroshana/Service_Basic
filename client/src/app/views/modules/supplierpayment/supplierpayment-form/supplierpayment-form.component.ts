import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Supplierpayment} from '../../../../entities/supplierpayment';
import {SupplierpaymentService} from '../../../../services/supplierpayment.service';
import {Purchase} from '../../../../entities/purchase';
import {DateHelper} from '../../../../shared/date-helper';
import {Paymenttype} from '../../../../entities/paymenttype';
import {PurchaseService} from '../../../../services/purchase.service';
import {PaymenttypeService} from '../../../../services/paymenttype.service';

@Component({
  selector: 'app-supplierpayment-form',
  templateUrl: './supplierpayment-form.component.html',
  styleUrls: ['./supplierpayment-form.component.scss']
})
export class SupplierpaymentFormComponent extends AbstractComponent implements OnInit {

  purchases: Purchase[] = [];
  paymenttypes: Paymenttype[] = [];

  form = new FormGroup({
    amount: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(99999999),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    date: new FormControl(null, [
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
    purchase: new FormControl(null, [
      Validators.required,
    ]),
    paymenttype: new FormControl(null, [
      Validators.required,
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get amountField(): FormControl{
    return this.form.controls.amount as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
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

  get purchaseField(): FormControl{
    return this.form.controls.purchase as FormControl;
  }

  get paymenttypeField(): FormControl{
    return this.form.controls.paymenttype as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private purchaseService: PurchaseService,
    private paymenttypeService: PaymenttypeService,
    private supplierpaymentService: SupplierpaymentService,
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

    this.purchaseService.getAllBasic(new PageRequest()).then((purchaseDataPage) => {
      this.purchases = purchaseDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.paymenttypeService.getAll().then((paymenttypes) => {
      this.paymenttypes = paymenttypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIERPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SUPPLIERPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SUPPLIERPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIERPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIERPAYMENT);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const supplierpayment: Supplierpayment = new Supplierpayment();
    supplierpayment.amount = this.amountField.value;
    supplierpayment.date = DateHelper.getDateAsString(this.dateField.value);
    supplierpayment.chequeno = this.chequenoField.value;
    supplierpayment.chequedate = DateHelper.getDateAsString(this.chequedateField.value);
    supplierpayment.chequebank = this.chequebankField.value;
    supplierpayment.chequebranch = this.chequebranchField.value;
    supplierpayment.purchase = this.purchaseField.value;
    supplierpayment.paymenttype = this.paymenttypeField.value;
    supplierpayment.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.supplierpaymentService.add(supplierpayment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/supplierpayments/' + resourceLink.id);
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
          if (msg.amount) { this.amountField.setErrors({server: msg.amount}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.chequeno) { this.chequenoField.setErrors({server: msg.chequeno}); knownError = true; }
          if (msg.chequedate) { this.chequedateField.setErrors({server: msg.chequedate}); knownError = true; }
          if (msg.chequebank) { this.chequebankField.setErrors({server: msg.chequebank}); knownError = true; }
          if (msg.chequebranch) { this.chequebranchField.setErrors({server: msg.chequebranch}); knownError = true; }
          if (msg.purchase) { this.purchaseField.setErrors({server: msg.purchase}); knownError = true; }
          if (msg.paymenttype) { this.paymenttypeField.setErrors({server: msg.paymenttype}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
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
