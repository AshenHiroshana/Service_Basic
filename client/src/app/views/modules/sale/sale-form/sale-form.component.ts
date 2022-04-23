import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Sale} from '../../../../entities/sale';
import {SaleService} from '../../../../services/sale.service';
import {ViewChild} from '@angular/core';
import {Customer} from '../../../../entities/customer';
import {Saletype} from '../../../../entities/saletype';
import {DateHelper} from '../../../../shared/date-helper';
import {CustomerService} from '../../../../services/customer.service';
import {SaletypeService} from '../../../../services/saletype.service';
import {SaleitemSubFormComponent} from './saleitem-sub-form/saleitem-sub-form.component';

@Component({
  selector: 'app-sale-form',
  templateUrl: './sale-form.component.html',
  styleUrls: ['./sale-form.component.scss']
})
export class SaleFormComponent extends AbstractComponent implements OnInit {

  customers: Customer[] = [];
  saletypes: Saletype[] = [];
  @ViewChild(SaleitemSubFormComponent) saleitemSubForm: SaleitemSubFormComponent;

  form = new FormGroup({
    date: new FormControl(null, [
      Validators.required,
    ]),
    customer: new FormControl(null, [
      Validators.required,
    ]),
    total: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(99999999),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    balance: new FormControl(null, [
      Validators.min(0),
      Validators.max(99999999),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    saletype: new FormControl(null, [
    ]),
    datetobepayed: new FormControl(null, [
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    saleitems: new FormControl(),
    transports: new FormControl(),
  });

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get customerField(): FormControl{
    return this.form.controls.customer as FormControl;
  }

  get totalField(): FormControl{
    return this.form.controls.total as FormControl;
  }

  get balanceField(): FormControl{
    return this.form.controls.balance as FormControl;
  }

  get saletypeField(): FormControl{
    return this.form.controls.saletype as FormControl;
  }

  get datetobepayedField(): FormControl{
    return this.form.controls.datetobepayed as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get saleitemsField(): FormControl{
    return this.form.controls.saleitems as FormControl;
  }

  constructor(
    private customerService: CustomerService,
    private saletypeService: SaletypeService,
    private saleService: SaleService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.saletypeService.getAll().then((saletypes) => {
      this.saletypes = saletypes;
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

    this.customerService.getAllBasic(new PageRequest()).then((customerDataPage) => {
      this.customers = customerDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SALE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SALES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SALE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SALE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SALE);
  }

  async submit(): Promise<void> {
    this.saleitemSubForm.resetForm();
    this.saleitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const sale: Sale = new Sale();
    sale.date = DateHelper.getDateAsString(this.dateField.value);
    sale.customer = this.customerField.value;
    sale.total = this.totalField.value;
    sale.balance = this.balanceField.value;
    sale.saletype = this.saletypeField.value;
    sale.datetobepayed = this.datetobepayedField.value ? DateHelper.getDateAsString(this.datetobepayedField.value) : null;
    sale.description = this.descriptionField.value;
    sale.saleitemList = this.saleitemsField.value;
    try{
      const resourceLink: ResourceLink = await this.saleService.add(sale);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/sales/' + resourceLink.id);
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
          if (msg.customer) { this.customerField.setErrors({server: msg.customer}); knownError = true; }
          if (msg.total) { this.totalField.setErrors({server: msg.total}); knownError = true; }
          if (msg.balance) { this.balanceField.setErrors({server: msg.balance}); knownError = true; }
          if (msg.saletype) { this.saletypeField.setErrors({server: msg.saletype}); knownError = true; }
          if (msg.datetobepayed) { this.datetobepayedField.setErrors({server: msg.datetobepayed}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.saleitemList) { this.saleitemsField.setErrors({server: msg.saleitemList}); knownError = true; }
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
