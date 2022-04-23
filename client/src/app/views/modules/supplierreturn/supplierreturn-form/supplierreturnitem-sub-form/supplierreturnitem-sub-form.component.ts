import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Supplierreturnitem} from '../../../../../entities/supplierreturnitem';
import {Item} from '../../../../../entities/item';
import {ItemService} from '../../../../../services/item.service';

@Component({
  selector: 'app-supplierreturnitem-sub-form',
  templateUrl: './supplierreturnitem-sub-form.component.html',
  styleUrls: ['./supplierreturnitem-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SupplierreturnitemSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SupplierreturnitemSubFormComponent),
      multi: true,
    }
  ]
})
export class SupplierreturnitemSubFormComponent extends AbstractSubFormComponent<Supplierreturnitem> implements OnInit{

  items: Item[] = [];

  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    item: new FormControl(),
    qty: new FormControl(),
    returnedunitprice: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get itemField(): FormControl{
    return this.form.controls.item as FormControl;
  }

  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }

  get returnedunitpriceField(): FormControl{
    return this.form.controls.returnedunitprice as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.itemField)
      &&   this.isEmptyField(this.qtyField)
      &&   this.isEmptyField(this.returnedunitpriceField);
  }

  constructor(
    private itemService: ItemService,
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.itemService.getAllBasic(new PageRequest()).then((itemDataPage) => {
      this.items = itemDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  setValidations(): void{
    this.hasValidations = true;
    this.qtyField.setValidators([
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,4})?)$'),
      Validators.max(99999999),
      Validators.min(1),
    ]);
    this.returnedunitpriceField.setValidators([
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
      Validators.max(99999999),
      Validators.min(0),
    ]);
  }

  removeValidations(): void{
    this.hasValidations = false;
    this.itemField.clearValidators();
    this.qtyField.clearValidators();
    this.returnedunitpriceField.clearValidators();
  }

  fillForm(dataItem: Supplierreturnitem): void {
    this.idField.patchValue(dataItem.id);
    this.itemField.patchValue(dataItem.item.id);
    this.qtyField.patchValue(dataItem.qty);
    this.returnedunitpriceField.patchValue(dataItem.returnedunitprice);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(supplierreturnitem: Supplierreturnitem): string {
    return 'Are you sure to remove \u201C ' + supplierreturnitem.id + ' \u201D from returned items?';
  }

  getUpdateConfirmMessage(supplierreturnitem: Supplierreturnitem): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + supplierreturnitem.id + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + supplierreturnitem.id + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Supplierreturnitem = new Supplierreturnitem();
    dataItem.id = this.idField.value;

    for (const item of this.items){
      if (this.itemField.value === item.id) {
        dataItem.item = item;
        break;
      }
    }

    dataItem.qty = this.qtyField.value;
    dataItem.returnedunitprice = this.returnedunitpriceField.value;
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }
}
