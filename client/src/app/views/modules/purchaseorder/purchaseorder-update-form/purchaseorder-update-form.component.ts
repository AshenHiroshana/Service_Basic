import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Purchaseorder} from '../../../../entities/purchaseorder';
import {PurchaseorderService} from '../../../../services/purchaseorder.service';
import {ViewChild} from '@angular/core';
import {Supplier} from '../../../../entities/supplier';
import {DateHelper} from '../../../../shared/date-helper';
import {SupplierService} from '../../../../services/supplier.service';
import {Purchaseorderstatus} from '../../../../entities/purchaseorderstatus';
import {PurchaseorderstatusService} from '../../../../services/purchaseorderstatus.service';
import {PurchaseorderitemUpdateSubFormComponent} from './purchaseorderitem-update-sub-form/purchaseorderitem-update-sub-form.component';

@Component({
  selector: 'app-purchaseorder-update-form',
  templateUrl: './purchaseorder-update-form.component.html',
  styleUrls: ['./purchaseorder-update-form.component.scss']
})
export class PurchaseorderUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  purchaseorder: Purchaseorder;

  suppliers: Supplier[] = [];
  purchaseorderstatuses: Purchaseorderstatus[] = [];
  @ViewChild(PurchaseorderitemUpdateSubFormComponent) purchaseorderitemUpdateSubForm: PurchaseorderitemUpdateSubFormComponent;

  form = new FormGroup({
    ordereddate: new FormControl(null, [
      Validators.required,
    ]),
    requireddate: new FormControl(null, [
      Validators.required,
    ]),
    supplier: new FormControl(null, [
      Validators.required,
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    reciveddate: new FormControl(null, [
    ]),
    purchaseorderstatus: new FormControl('1', [
      Validators.required,
    ]),
    purchaseorderitems: new FormControl(),
  });

  get ordereddateField(): FormControl{
    return this.form.controls.ordereddate as FormControl;
  }

  get requireddateField(): FormControl{
    return this.form.controls.requireddate as FormControl;
  }

  get supplierField(): FormControl{
    return this.form.controls.supplier as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get reciveddateField(): FormControl{
    return this.form.controls.reciveddate as FormControl;
  }

  get purchaseorderstatusField(): FormControl{
    return this.form.controls.purchaseorderstatus as FormControl;
  }

  get purchaseorderitemsField(): FormControl{
    return this.form.controls.purchaseorderitems as FormControl;
  }

  constructor(
    private supplierService: SupplierService,
    private purchaseorderstatusService: PurchaseorderstatusService,
    private purchaseorderService: PurchaseorderService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
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
    this.purchaseorderstatusService.getAll().then((purchaseorderstatuses) => {
      this.purchaseorderstatuses = purchaseorderstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.purchaseorder = await this.purchaseorderService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PURCHASEORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PURCHASEORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PURCHASEORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PURCHASEORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PURCHASEORDER);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.ordereddateField.pristine) {
      this.ordereddateField.setValue(this.purchaseorder.ordereddate);
    }
    if (this.requireddateField.pristine) {
      this.requireddateField.setValue(this.purchaseorder.requireddate);
    }
    if (this.supplierField.pristine) {
      this.supplierField.setValue(this.purchaseorder.supplier.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.purchaseorder.description);
    }
    if (this.reciveddateField.pristine) {
      this.reciveddateField.setValue(this.purchaseorder.reciveddate);
    }
    if (this.purchaseorderstatusField.pristine) {
      this.purchaseorderstatusField.setValue(this.purchaseorder.purchaseorderstatus.id);
    }
    if (this.purchaseorderitemsField.pristine) {
      this.purchaseorderitemsField.setValue(this.purchaseorder.purchaseorderitemList);
    }
}

  async submit(): Promise<void> {
    this.purchaseorderitemUpdateSubForm.resetForm();
    this.purchaseorderitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newpurchaseorder: Purchaseorder = new Purchaseorder();
    newpurchaseorder.ordereddate = DateHelper.getDateAsString(this.ordereddateField.value);
    newpurchaseorder.requireddate = DateHelper.getDateAsString(this.requireddateField.value);
    newpurchaseorder.supplier = this.supplierField.value;
    newpurchaseorder.description = this.descriptionField.value;
    newpurchaseorder.reciveddate = this.reciveddateField.value ? DateHelper.getDateAsString(this.reciveddateField.value) : null;
    newpurchaseorder.purchaseorderstatus = this.purchaseorderstatusField.value;
    newpurchaseorder.purchaseorderitemList = this.purchaseorderitemsField.value;
    try{
      const resourceLink: ResourceLink = await this.purchaseorderService.update(this.selectedId, newpurchaseorder);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/purchaseorders/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/purchaseorders');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.ordereddate) { this.ordereddateField.setErrors({server: msg.ordereddate}); knownError = true; }
          if (msg.requireddate) { this.requireddateField.setErrors({server: msg.requireddate}); knownError = true; }
          if (msg.supplier) { this.supplierField.setErrors({server: msg.supplier}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.reciveddate) { this.reciveddateField.setErrors({server: msg.reciveddate}); knownError = true; }
          if (msg.purchaseorderstatus) { this.purchaseorderstatusField.setErrors({server: msg.purchaseorderstatus}); knownError = true; }
          if (msg.purchaseorderitemList) { this.purchaseorderitemsField.setErrors({server: msg.purchaseorderitemList}); knownError = true; }
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
