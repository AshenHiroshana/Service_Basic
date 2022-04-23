import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Supplier} from '../../../../entities/supplier';
import {SupplierService} from '../../../../services/supplier.service';
import {Supplierstatus} from '../../../../entities/supplierstatus';
import {SupplierstatusService} from '../../../../services/supplierstatus.service';

@Component({
  selector: 'app-supplier-update-form',
  templateUrl: './supplier-update-form.component.html',
  styleUrls: ['./supplier-update-form.component.scss']
})
export class SupplierUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  supplier: Supplier;

  supplierstatuses: Supplierstatus[] = [];

  form = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
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
    fax: new FormControl(null, [
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
      Validators.minLength(4),
      Validators.maxLength(1000),
    ]),
    creditallowed: new FormControl(null, [
      Validators.min(0),
      Validators.max(99999999),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65536),
    ]),
    supplierstatus: new FormControl('1', [
    ]),
  });

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get contact1Field(): FormControl{
    return this.form.controls.contact1 as FormControl;
  }

  get contact2Field(): FormControl{
    return this.form.controls.contact2 as FormControl;
  }

  get faxField(): FormControl{
    return this.form.controls.fax as FormControl;
  }

  get emailField(): FormControl{
    return this.form.controls.email as FormControl;
  }

  get addressField(): FormControl{
    return this.form.controls.address as FormControl;
  }

  get creditallowedField(): FormControl{
    return this.form.controls.creditallowed as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get supplierstatusField(): FormControl{
    return this.form.controls.supplierstatus as FormControl;
  }

  constructor(
    private supplierstatusService: SupplierstatusService,
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.supplierstatusService.getAll().then((supplierstatuses) => {
      this.supplierstatuses = supplierstatuses;
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

    this.supplier = await this.supplierService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SUPPLIERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SUPPLIER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIER);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.nameField.pristine) {
      this.nameField.setValue(this.supplier.name);
    }
    if (this.contact1Field.pristine) {
      this.contact1Field.setValue(this.supplier.contact1);
    }
    if (this.contact2Field.pristine) {
      this.contact2Field.setValue(this.supplier.contact2);
    }
    if (this.faxField.pristine) {
      this.faxField.setValue(this.supplier.fax);
    }
    if (this.emailField.pristine) {
      this.emailField.setValue(this.supplier.email);
    }
    if (this.addressField.pristine) {
      this.addressField.setValue(this.supplier.address);
    }
    if (this.creditallowedField.pristine) {
      this.creditallowedField.setValue(this.supplier.creditallowed);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.supplier.description);
    }
    if (this.supplierstatusField.pristine) {
      this.supplierstatusField.setValue(this.supplier.supplierstatus.id);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newsupplier: Supplier = new Supplier();
    newsupplier.name = this.nameField.value;
    newsupplier.contact1 = this.contact1Field.value;
    newsupplier.contact2 = this.contact2Field.value;
    newsupplier.fax = this.faxField.value;
    newsupplier.email = this.emailField.value;
    newsupplier.address = this.addressField.value;
    newsupplier.creditallowed = this.creditallowedField.value;
    newsupplier.description = this.descriptionField.value;
    newsupplier.supplierstatus = this.supplierstatusField.value;
    try{
      const resourceLink: ResourceLink = await this.supplierService.update(this.selectedId, newsupplier);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/suppliers/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/suppliers');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.contact1) { this.contact1Field.setErrors({server: msg.contact1}); knownError = true; }
          if (msg.contact2) { this.contact2Field.setErrors({server: msg.contact2}); knownError = true; }
          if (msg.fax) { this.faxField.setErrors({server: msg.fax}); knownError = true; }
          if (msg.email) { this.emailField.setErrors({server: msg.email}); knownError = true; }
          if (msg.address) { this.addressField.setErrors({server: msg.address}); knownError = true; }
          if (msg.creditallowed) { this.creditallowedField.setErrors({server: msg.creditallowed}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.supplierstatus) { this.supplierstatusField.setErrors({server: msg.supplierstatus}); knownError = true; }
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
