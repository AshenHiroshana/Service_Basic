import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Purchaseorder, PurchaseorderDataPage} from '../../../../entities/purchaseorder';
import {PurchaseorderService} from '../../../../services/purchaseorder.service';
import {Supplier} from '../../../../entities/supplier';
import {SupplierService} from '../../../../services/supplier.service';
import {Purchaseorderstatus} from '../../../../entities/purchaseorderstatus';
import {PurchaseorderstatusService} from '../../../../services/purchaseorderstatus.service';

@Component({
  selector: 'app-purchaseorder-table',
  templateUrl: './purchaseorder-table.component.html',
  styleUrls: ['./purchaseorder-table.component.scss']
})
export class PurchaseorderTableComponent extends AbstractComponent implements OnInit {

  purchaseorderDataPage: PurchaseorderDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  suppliers: Supplier[] = [];
  purchaseorderstatuses: Purchaseorderstatus[] = [];

  codeField = new FormControl();
  supplierField = new FormControl();
  purchaseorderstatusField = new FormControl();

  constructor(
    private supplierService: SupplierService,
    private purchaseorderstatusService: PurchaseorderstatusService,
    private purchaseorderService: PurchaseorderService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {

    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();

    if (!this.privilege.showAll) { return; }

    this.setDisplayedColumns();

    const pageRequest = new PageRequest();
    pageRequest.pageIndex  = this.pageIndex;
    pageRequest.pageSize  = this.pageSize;

    pageRequest.addSearchCriteria('code', this.codeField.value);
    pageRequest.addSearchCriteria('supplier', this.supplierField.value);
    pageRequest.addSearchCriteria('purchaseorderstatus', this.purchaseorderstatusField.value);

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

    this.purchaseorderService.getAll(pageRequest).then((page: PurchaseorderDataPage) => {
      this.purchaseorderDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PURCHASEORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PURCHASEORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PURCHASEORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PURCHASEORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PURCHASEORDER);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'ordereddate', 'requireddate', 'supplier', 'reciveddate', 'purchaseorderstatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(purchaseorder: Purchaseorder): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: purchaseorder.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.purchaseorderService.delete(purchaseorder.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
