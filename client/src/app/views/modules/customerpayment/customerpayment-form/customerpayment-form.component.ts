import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Customerpayment} from '../../../../entities/customerpayment';
import {CustomerpaymentService} from '../../../../services/customerpayment.service';
import {Sale} from '../../../../entities/sale';
import {DateHelper} from '../../../../shared/date-helper';
import {Paymenttype} from '../../../../entities/paymenttype';
import {SaleService} from '../../../../services/sale.service';
import {PaymenttypeService} from '../../../../services/paymenttype.service';

@Component({
  selector: 'app-customerpayment-form',
  templateUrl: './customerpayment-form.component.html',
  styleUrls: ['./customerpayment-form.component.scss']
})
export class CustomerpaymentFormComponent extends AbstractComponent implements OnInit {

  sales: Sale[] = [];
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
    sale: new FormControl(null, [
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

  get saleField(): FormControl{
    return this.form.controls.sale as FormControl;
  }

  get paymenttypeField(): FormControl{
    return this.form.controls.paymenttype as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private saleService: SaleService,
    private paymenttypeService: PaymenttypeService,
    private customerpaymentService: CustomerpaymentService,
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

    this.saleService.getAllBasic(new PageRequest()).then((saleDataPage) => {
      this.sales = saleDataPage.content;
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMERPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMERPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMERPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMERPAYMENT);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const customerpayment: Customerpayment = new Customerpayment();
    customerpayment.amount = this.amountField.value;
    customerpayment.date = DateHelper.getDateAsString(this.dateField.value);
    customerpayment.chequeno = this.chequenoField.value;
    customerpayment.chequedate = DateHelper.getDateAsString(this.chequedateField.value);
    customerpayment.chequebank = this.chequebankField.value;
    customerpayment.chequebranch = this.chequebranchField.value;
    customerpayment.sale = this.saleField.value;
    customerpayment.paymenttype = this.paymenttypeField.value;
    customerpayment.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.customerpaymentService.add(customerpayment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/customerpayments/' + resourceLink.id);
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
          if (msg.sale) { this.saleField.setErrors({server: msg.sale}); knownError = true; }
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
