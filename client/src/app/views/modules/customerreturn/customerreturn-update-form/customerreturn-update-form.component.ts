import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
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
import {CustomerreturnitemUpdateSubFormComponent} from './customerreturnitem-update-sub-form/customerreturnitem-update-sub-form.component';

@Component({
  selector: 'app-customerreturn-update-form',
  templateUrl: './customerreturn-update-form.component.html',
  styleUrls: ['./customerreturn-update-form.component.scss']
})
export class CustomerreturnUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  customerreturn: Customerreturn;

  sales: Sale[] = [];
  paymenttypes: Paymenttype[] = [];
  paymentstatuses: Paymentstatus[] = [];
  @ViewChild(CustomerreturnitemUpdateSubFormComponent) customerreturnitemUpdateSubForm: CustomerreturnitemUpdateSubFormComponent;

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
    private route: ActivatedRoute,
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
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.saleService.getAllBasic(new PageRequest()).then((saleDataPage) => {
      this.sales = saleDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.customerreturn = await this.customerreturnService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMERRETURN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERRETURNS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMERRETURN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMERRETURN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMERRETURN);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.saleField.pristine) {
      this.saleField.setValue(this.customerreturn.sale.id);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.customerreturn.date);
    }
    if (this.reasonField.pristine) {
      this.reasonField.setValue(this.customerreturn.reason);
    }
    if (this.paymenttypeField.pristine) {
      this.paymenttypeField.setValue(this.customerreturn.paymenttype.id);
    }
    if (this.paymentstatusField.pristine) {
      this.paymentstatusField.setValue(this.customerreturn.paymentstatus.id);
    }
    if (this.chequenoField.pristine) {
      this.chequenoField.setValue(this.customerreturn.chequeno);
    }
    if (this.chequedateField.pristine) {
      this.chequedateField.setValue(this.customerreturn.chequedate);
    }
    if (this.chequebankField.pristine) {
      this.chequebankField.setValue(this.customerreturn.chequebank);
    }
    if (this.chequebranchField.pristine) {
      this.chequebranchField.setValue(this.customerreturn.chequebranch);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.customerreturn.description);
    }
    if (this.customerreturnitemsField.pristine) {
      this.customerreturnitemsField.setValue(this.customerreturn.customerreturnitemList);
    }
}

  async submit(): Promise<void> {
    this.customerreturnitemUpdateSubForm.resetForm();
    this.customerreturnitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newcustomerreturn: Customerreturn = new Customerreturn();
    newcustomerreturn.sale = this.saleField.value;
    newcustomerreturn.date = DateHelper.getDateAsString(this.dateField.value);
    newcustomerreturn.reason = this.reasonField.value;
    newcustomerreturn.paymenttype = this.paymenttypeField.value;
    newcustomerreturn.paymentstatus = this.paymentstatusField.value;
    newcustomerreturn.chequeno = this.chequenoField.value;
    newcustomerreturn.chequedate = DateHelper.getDateAsString(this.chequedateField.value);
    newcustomerreturn.chequebank = this.chequebankField.value;
    newcustomerreturn.chequebranch = this.chequebranchField.value;
    newcustomerreturn.description = this.descriptionField.value;
    newcustomerreturn.customerreturnitemList = this.customerreturnitemsField.value;
    try{
      const resourceLink: ResourceLink = await this.customerreturnService.update(this.selectedId, newcustomerreturn);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/customerreturns/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/customerreturns');
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
