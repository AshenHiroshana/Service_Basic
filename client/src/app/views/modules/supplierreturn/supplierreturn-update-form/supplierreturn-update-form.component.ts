import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
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
import {SupplierreturnitemUpdateSubFormComponent} from './supplierreturnitem-update-sub-form/supplierreturnitem-update-sub-form.component';

@Component({
  selector: 'app-supplierreturn-update-form',
  templateUrl: './supplierreturn-update-form.component.html',
  styleUrls: ['./supplierreturn-update-form.component.scss']
})
export class SupplierreturnUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  supplierreturn: Supplierreturn;

  suppliers: Supplier[] = [];
  paymenttypes: Paymenttype[] = [];
  paymentstatuses: Paymentstatus[] = [];
  @ViewChild(SupplierreturnitemUpdateSubFormComponent) supplierreturnitemUpdateSubForm: SupplierreturnitemUpdateSubFormComponent;

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

    this.supplierService.getAllBasic(new PageRequest()).then((supplierDataPage) => {
      this.suppliers = supplierDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.supplierreturn = await this.supplierreturnService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIERRETURN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SUPPLIERRETURNS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SUPPLIERRETURN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIERRETURN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIERRETURN);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.supplierField.pristine) {
      this.supplierField.setValue(this.supplierreturn.supplier.id);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.supplierreturn.date);
    }
    if (this.reasonField.pristine) {
      this.reasonField.setValue(this.supplierreturn.reason);
    }
    if (this.paymenttypeField.pristine) {
      this.paymenttypeField.setValue(this.supplierreturn.paymenttype.id);
    }
    if (this.paymentstatusField.pristine) {
      this.paymentstatusField.setValue(this.supplierreturn.paymentstatus.id);
    }
    if (this.chequenoField.pristine) {
      this.chequenoField.setValue(this.supplierreturn.chequeno);
    }
    if (this.chequedateField.pristine) {
      this.chequedateField.setValue(this.supplierreturn.chequedate);
    }
    if (this.chequebankField.pristine) {
      this.chequebankField.setValue(this.supplierreturn.chequebank);
    }
    if (this.chequebranchField.pristine) {
      this.chequebranchField.setValue(this.supplierreturn.chequebranch);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.supplierreturn.description);
    }
    if (this.supplierreturnitemsField.pristine) {
      this.supplierreturnitemsField.setValue(this.supplierreturn.supplierreturnitemList);
    }
}

  async submit(): Promise<void> {
    this.supplierreturnitemUpdateSubForm.resetForm();
    this.supplierreturnitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newsupplierreturn: Supplierreturn = new Supplierreturn();
    newsupplierreturn.supplier = this.supplierField.value;
    newsupplierreturn.date = DateHelper.getDateAsString(this.dateField.value);
    newsupplierreturn.reason = this.reasonField.value;
    newsupplierreturn.paymenttype = this.paymenttypeField.value;
    newsupplierreturn.paymentstatus = this.paymentstatusField.value;
    newsupplierreturn.chequeno = this.chequenoField.value;
    newsupplierreturn.chequedate = DateHelper.getDateAsString(this.chequedateField.value);
    newsupplierreturn.chequebank = this.chequebankField.value;
    newsupplierreturn.chequebranch = this.chequebranchField.value;
    newsupplierreturn.description = this.descriptionField.value;
    newsupplierreturn.supplierreturnitemList = this.supplierreturnitemsField.value;
    try{
      const resourceLink: ResourceLink = await this.supplierreturnService.update(this.selectedId, newsupplierreturn);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/supplierreturns/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/supplierreturns');
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
