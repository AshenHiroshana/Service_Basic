import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Item} from '../../../../entities/item';
import {ItemService} from '../../../../services/item.service';
import {Unit} from '../../../../entities/unit';
import {Supplier} from '../../../../entities/supplier';
import {Itemstatus} from '../../../../entities/itemstatus';
import {UnitService} from '../../../../services/unit.service';
import {Itemcategory} from '../../../../entities/itemcategory';
import {SupplierService} from '../../../../services/supplier.service';
import {ItemstatusService} from '../../../../services/itemstatus.service';
import {ItemcategoryService} from '../../../../services/itemcategory.service';

@Component({
  selector: 'app-item-update-form',
  templateUrl: './item-update-form.component.html',
  styleUrls: ['./item-update-form.component.scss']
})
export class ItemUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  item: Item;

  itemcategories: Itemcategory[] = [];
  units: Unit[] = [];
  suppliers: Supplier[] = [];
  itemstatuses: Itemstatus[] = [];

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
    itemstatus: new FormControl('1', [
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

  get itemstatusField(): FormControl{
    return this.form.controls.itemstatus as FormControl;
  }

  constructor(
    private itemcategoryService: ItemcategoryService,
    private unitService: UnitService,
    private supplierService: SupplierService,
    private itemstatusService: ItemstatusService,
    private itemService: ItemService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.itemstatusService.getAll().then((itemstatuses) => {
      this.itemstatuses = itemstatuses;
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
    this.item = await this.itemService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ITEM);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ITEMS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ITEM_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ITEM);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ITEM);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.nameField.pristine) {
      this.nameField.setValue(this.item.name);
    }
    if (this.itemcategoryField.pristine) {
      this.itemcategoryField.setValue(this.item.itemcategory.id);
    }
    if (this.unitField.pristine) {
      this.unitField.setValue(this.item.unit.id);
    }
    if (this.supplierField.pristine) {
      this.supplierField.setValue(this.item.supplier.id);
    }
    if (this.photoField.pristine) {
      if (this.item.photo) { this.photoField.setValue([this.item.photo]); }
      else { this.photoField.setValue([]); }
    }
    if (this.priceField.pristine) {
      this.priceField.setValue(this.item.price);
    }
    if (this.qtyField.pristine) {
      this.qtyField.setValue(this.item.qty);
    }
    if (this.ropField.pristine) {
      this.ropField.setValue(this.item.rop);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.item.description);
    }
    if (this.itemstatusField.pristine) {
      this.itemstatusField.setValue(this.item.itemstatus.id);
    }
}

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    if (this.form.invalid) { return; }

    const newitem: Item = new Item();
    newitem.name = this.nameField.value;
    newitem.itemcategory = this.itemcategoryField.value;
    newitem.unit = this.unitField.value;
    newitem.supplier = this.supplierField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      newitem.photo = photoIds[0];
    }else{
      newitem.photo = null;
    }
    newitem.price = this.priceField.value;
    newitem.qty = this.qtyField.value;
    newitem.rop = this.ropField.value;
    newitem.description = this.descriptionField.value;
    newitem.itemstatus = this.itemstatusField.value;
    try{
      const resourceLink: ResourceLink = await this.itemService.update(this.selectedId, newitem);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/items/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/items');
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
          if (msg.itemstatus) { this.itemstatusField.setErrors({server: msg.itemstatus}); knownError = true; }
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
