import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Sale, SaleDataPage} from '../../../../entities/sale';
import {SaleService} from '../../../../services/sale.service';
import {Customer} from '../../../../entities/customer';
import {Saletype} from '../../../../entities/saletype';
import {CustomerService} from '../../../../services/customer.service';
import {SaletypeService} from '../../../../services/saletype.service';

@Component({
  selector: 'app-sale-table',
  templateUrl: './sale-table.component.html',
  styleUrls: ['./sale-table.component.scss']
})
export class SaleTableComponent extends AbstractComponent implements OnInit {

  saleDataPage: SaleDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  customers: Customer[] = [];
  saletypes: Saletype[] = [];

  codeField = new FormControl();
  customerField = new FormControl();
  saletypeField = new FormControl();

  constructor(
    private customerService: CustomerService,
    private saletypeService: SaletypeService,
    private saleService: SaleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.saletypeService.getAll().then((saletypes) => {
      this.saletypes = saletypes;
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
    pageRequest.addSearchCriteria('customer', this.customerField.value);
    pageRequest.addSearchCriteria('saletype', this.saletypeField.value);

    this.customerService.getAllBasic(new PageRequest()).then((customerDataPage) => {
      this.customers = customerDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.saleService.getAll(pageRequest).then((page: SaleDataPage) => {
      this.saleDataPage = page;
    }).catch( e => {
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

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'customer', 'saletype'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(sale: Sale): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: sale.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.saleService.delete(sale.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
