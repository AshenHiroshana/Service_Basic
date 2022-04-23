import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Customer} from '../../../../entities/customer';
import {CustomerService} from '../../../../services/customer.service';
import {Nametitle} from '../../../../entities/nametitle';
import {Customerstatus} from '../../../../entities/customerstatus';
import {NametitleService} from '../../../../services/nametitle.service';
import {CustomerstatusService} from '../../../../services/customerstatus.service';

@Component({
  selector: 'app-customer-update-form',
  templateUrl: './customer-update-form.component.html',
  styleUrls: ['./customer-update-form.component.scss']
})
export class CustomerUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  customer: Customer;

  nametitles: Nametitle[] = [];
  customerstatuses: Customerstatus[] = [];

  form = new FormGroup({
    nametitle: new FormControl(null, [
      Validators.required,
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    nic: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(12),
      Validators.pattern('^(([0-9]{12})|([0-9]{9}[vVxX]))$'),
    ]),
    contact1: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][0-9]{9})$'),
    ]),
    contact2: new FormControl(null, [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][0-9]{9})$'),
    ]),
    email: new FormControl(null, [
      Validators.minLength(5),
      Validators.maxLength(255),
    ]),
    address: new FormControl(null, [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(1000),
    ]),
    creditlimit: new FormControl(null, [
      Validators.min(0),
      Validators.max(99999999),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    customerstatus: new FormControl('1', [
    ]),
  });

  get nametitleField(): FormControl{
    return this.form.controls.nametitle as FormControl;
  }

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get nicField(): FormControl{
    return this.form.controls.nic as FormControl;
  }

  get contact1Field(): FormControl{
    return this.form.controls.contact1 as FormControl;
  }

  get contact2Field(): FormControl{
    return this.form.controls.contact2 as FormControl;
  }

  get emailField(): FormControl{
    return this.form.controls.email as FormControl;
  }

  get addressField(): FormControl{
    return this.form.controls.address as FormControl;
  }

  get creditlimitField(): FormControl{
    return this.form.controls.creditlimit as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get customerstatusField(): FormControl{
    return this.form.controls.customerstatus as FormControl;
  }

  constructor(
    private nametitleService: NametitleService,
    private customerstatusService: CustomerstatusService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.nametitleService.getAll().then((nametitles) => {
      this.nametitles = nametitles;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.customerstatusService.getAll().then((customerstatuses) => {
      this.customerstatuses = customerstatuses;
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

    this.customer = await this.customerService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMER);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.nametitleField.pristine) {
      this.nametitleField.setValue(this.customer.nametitle.id);
    }
    if (this.nameField.pristine) {
      this.nameField.setValue(this.customer.name);
    }
    if (this.nicField.pristine) {
      this.nicField.setValue(this.customer.nic);
    }
    if (this.contact1Field.pristine) {
      this.contact1Field.setValue(this.customer.contact1);
    }
    if (this.contact2Field.pristine) {
      this.contact2Field.setValue(this.customer.contact2);
    }
    if (this.emailField.pristine) {
      this.emailField.setValue(this.customer.email);
    }
    if (this.addressField.pristine) {
      this.addressField.setValue(this.customer.address);
    }
    if (this.creditlimitField.pristine) {
      this.creditlimitField.setValue(this.customer.creditlimit);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.customer.description);
    }
    if (this.customerstatusField.pristine) {
      this.customerstatusField.setValue(this.customer.customerstatus.id);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newcustomer: Customer = new Customer();
    newcustomer.nametitle = this.nametitleField.value;
    newcustomer.name = this.nameField.value;
    newcustomer.nic = this.nicField.value;
    newcustomer.contact1 = this.contact1Field.value;
    newcustomer.contact2 = this.contact2Field.value;
    newcustomer.email = this.emailField.value;
    newcustomer.address = this.addressField.value;
    newcustomer.creditlimit = this.creditlimitField.value;
    newcustomer.description = this.descriptionField.value;
    newcustomer.customerstatus = this.customerstatusField.value;
    try{
      const resourceLink: ResourceLink = await this.customerService.update(this.selectedId, newcustomer);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/customers/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/customers');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.nametitle) { this.nametitleField.setErrors({server: msg.nametitle}); knownError = true; }
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.nic) { this.nicField.setErrors({server: msg.nic}); knownError = true; }
          if (msg.contact1) { this.contact1Field.setErrors({server: msg.contact1}); knownError = true; }
          if (msg.contact2) { this.contact2Field.setErrors({server: msg.contact2}); knownError = true; }
          if (msg.email) { this.emailField.setErrors({server: msg.email}); knownError = true; }
          if (msg.address) { this.addressField.setErrors({server: msg.address}); knownError = true; }
          if (msg.creditlimit) { this.creditlimitField.setErrors({server: msg.creditlimit}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.customerstatus) { this.customerstatusField.setErrors({server: msg.customerstatus}); knownError = true; }
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
