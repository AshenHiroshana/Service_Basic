import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Purchase, PurchaseDataPage} from '../../../../entities/purchase';
import {PurchaseService} from '../../../../services/purchase.service';
import {Supplier} from '../../../../entities/supplier';
import {Purchaseorder} from '../../../../entities/purchaseorder';
import {Purchasestatus} from '../../../../entities/purchasestatus';
import {SupplierService} from '../../../../services/supplier.service';
import {PurchaseorderService} from '../../../../services/purchaseorder.service';
import {PurchasestatusService} from '../../../../services/purchasestatus.service';

@Component({
  selector: 'app-purchase-table',
  templateUrl: './purchase-table.component.html',
  styleUrls: ['./purchase-table.component.scss']
})
export class PurchaseTableComponent extends AbstractComponent implements OnInit {

  purchaseDataPage: PurchaseDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  suppliers: Supplier[] = [];
  purchaseorders: Purchaseorder[] = [];
  purchasestatuses: Purchasestatus[] = [];

  codeField = new FormControl();
  supplierField = new FormControl();
  purchaseorderField = new FormControl();
  purchasestatusField = new FormControl();

  constructor(
    private supplierService: SupplierService,
    private purchaseorderService: PurchaseorderService,
    private purchasestatusService: PurchasestatusService,
    private purchaseService: PurchaseService,
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
    pageRequest.addSearchCriteria('purchaseorder', this.purchaseorderField.value);
    pageRequest.addSearchCriteria('purchasestatus', this.purchasestatusField.value);

    this.supplierService.getAllBasic(new PageRequest()).then((supplierDataPage) => {
      this.suppliers = supplierDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.purchaseorderService.getAllBasic(new PageRequest()).then((purchaseorderDataPage) => {
      this.purchaseorders = purchaseorderDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.purchasestatusService.getAll().then((purchasestatuses) => {
      this.purchasestatuses = purchasestatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.purchaseService.getAll(pageRequest).then((page: PurchaseDataPage) => {
      this.purchaseDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PURCHASE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PURCHASES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PURCHASE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PURCHASE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PURCHASE);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'date', 'supplier', 'total', 'purchaseorder', 'purchasestatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(purchase: Purchase): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: purchase.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.purchaseService.delete(purchase.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
