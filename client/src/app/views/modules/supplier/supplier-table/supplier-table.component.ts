import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Supplier, SupplierDataPage} from '../../../../entities/supplier';
import {SupplierService} from '../../../../services/supplier.service';
import {Supplierstatus} from '../../../../entities/supplierstatus';
import {SupplierstatusService} from '../../../../services/supplierstatus.service';

@Component({
  selector: 'app-supplier-table',
  templateUrl: './supplier-table.component.html',
  styleUrls: ['./supplier-table.component.scss']
})
export class SupplierTableComponent extends AbstractComponent implements OnInit {

  supplierDataPage: SupplierDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  supplierstatuses: Supplierstatus[] = [];

  codeField = new FormControl();
  nameField = new FormControl();
  supplierstatusField = new FormControl();

  constructor(
    private supplierstatusService: SupplierstatusService,
    private supplierService: SupplierService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.supplierstatusService.getAll().then((supplierstatuses) => {
      this.supplierstatuses = supplierstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

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
    pageRequest.addSearchCriteria('name', this.nameField.value);
    pageRequest.addSearchCriteria('supplierstatus', this.supplierstatusField.value);


    this.supplierService.getAll(pageRequest).then((page: SupplierDataPage) => {
      this.supplierDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SUPPLIERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SUPPLIER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIER);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'name', 'supplierstatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(supplier: Supplier): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: supplier.code + ' ' + supplier.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.supplierService.delete(supplier.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
