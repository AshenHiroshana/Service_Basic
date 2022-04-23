import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Item} from '../../../../entities/item';
import {ItemService} from '../../../../services/item.service';
import {Unit} from '../../../../entities/unit';
import {Supplier} from '../../../../entities/supplier';
import {UnitService} from '../../../../services/unit.service';
import {Itemcategory} from '../../../../entities/itemcategory';
import {SupplierService} from '../../../../services/supplier.service';
import {ItemcategoryService} from '../../../../services/itemcategory.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent extends AbstractComponent implements OnInit {

  itemcategories: Itemcategory[] = [];
  units: Unit[] = [];
  suppliers: Supplier[] = [];

  form = new FormGroup({
    name: new FormControl(null, [
      Validators.minLength(3),
      Validators.maxLength(255),
    ]),
    itemcategory: new FormControl(null, [
      Validators.required,
    ]),
    unit: new FormControl(null, [
      Validators.required,
    ]),
    supplier: new FormControl(null, [
      Validators.required,
    ]),
    photo: new FormControl(),
    price: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(99999999),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    qty: new FormControl(null, [
      Validators.min(0),
      Validators.max(999999999),
      Validators.pattern('^([0-9]{1,9}([.][0-9]{1,3})?)$'),
    ]),
    rop: new FormControl(null, [
      Validators.min(0),
      Validators.max(999999999),
      Validators.pattern('^([0-9]{1,9}([.][0-9]{1,3})?)$'),
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get itemcategoryField(): FormControl{
    return this.form.controls.itemcategory as FormControl;
  }

  get unitField(): FormControl{
    return this.form.controls.unit as FormControl;
  }

  get supplierField(): FormControl{
    return this.form.controls.supplier as FormControl;
  }

  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }

  get priceField(): FormControl{
    return this.form.controls.price as FormControl;
  }

  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }

  get ropField(): FormControl{
    return this.form.controls.rop as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private itemcategoryService: ItemcategoryService,
    private unitService: UnitService,
    private supplierService: SupplierService,
    private itemService: ItemService,
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

    this.itemcategoryService.getAll().then((itemcategories) => {
      this.itemcategories = itemcategories;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.unitService.getAll().then((units) => {
      this.units = units;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.supplierService.getAllBasic(new PageRequest()).then((supplierDataPage) => {
      this.suppliers = supplierDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ITEM);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ITEMS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ITEM_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ITEM);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ITEM);
  }

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    if (this.form.invalid) { return; }

    const item: Item = new Item();
    item.name = this.nameField.value;
    item.itemcategory = this.itemcategoryField.value;
    item.unit = this.unitField.value;
    item.supplier = this.supplierField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      item.photo = photoIds[0];
    }else{
      item.photo = null;
    }
    item.price = this.priceField.value;
    item.qty = this.qtyField.value;
    item.rop = this.ropField.value;
    item.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.itemService.add(item);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/items/' + resourceLink.id);
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
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.itemcategory) { this.itemcategoryField.setErrors({server: msg.itemcategory}); knownError = true; }
          if (msg.unit) { this.unitField.setErrors({server: msg.unit}); knownError = true; }
          if (msg.supplier) { this.supplierField.setErrors({server: msg.supplier}); knownError = true; }
          if (msg.photo) { this.photoField.setErrors({server: msg.photo}); knownError = true; }
          if (msg.price) { this.priceField.setErrors({server: msg.price}); knownError = true; }
          if (msg.qty) { this.qtyField.setErrors({server: msg.qty}); knownError = true; }
          if (msg.rop) { this.ropField.setErrors({server: msg.rop}); knownError = true; }
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
