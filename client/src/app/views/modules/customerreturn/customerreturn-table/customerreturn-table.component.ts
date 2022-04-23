import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Customerreturn, CustomerreturnDataPage} from '../../../../entities/customerreturn';
import {CustomerreturnService} from '../../../../services/customerreturn.service';
import {Sale} from '../../../../entities/sale';
import {Paymenttype} from '../../../../entities/paymenttype';
import {SaleService} from '../../../../services/sale.service';
import {Paymentstatus} from '../../../../entities/paymentstatus';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {PaymentstatusService} from '../../../../services/paymentstatus.service';

@Component({
  selector: 'app-customerreturn-table',
  templateUrl: './customerreturn-table.component.html',
  styleUrls: ['./customerreturn-table.component.scss']
})
export class CustomerreturnTableComponent extends AbstractComponent implements OnInit {

  customerreturnDataPage: CustomerreturnDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  sales: Sale[] = [];
  paymenttypes: Paymenttype[] = [];
  paymentstatuses: Paymentstatus[] = [];

  codeField = new FormControl();
  saleField = new FormControl();
  paymenttypeField = new FormControl();
  paymentstatusField = new FormControl();
  chequenoField = new FormControl();
  chequebankField = new FormControl();
  chequebranchField = new FormControl();

  constructor(
    private saleService: SaleService,
    private paymenttypeService: PaymenttypeService,
    private paymentstatusService: PaymentstatusService,
    private customerreturnService: CustomerreturnService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.paymenttypeService.getAll().then((paymenttypes) => {
      this.paymenttypes = paymenttypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.paymentstatusService.getAll().then((paymentstatuses) => {
      this.paymentstatuses = paymentstatuses;
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
    pageRequest.addSearchCriteria('sale', this.saleField.value);
    pageRequest.addSearchCriteria('paymenttype', this.paymenttypeField.value);
    pageRequest.addSearchCriteria('paymentstatus', this.paymentstatusField.value);
    pageRequest.addSearchCriteria('chequeno', this.chequenoField.value);
    pageRequest.addSearchCriteria('chequebank', this.chequebankField.value);
    pageRequest.addSearchCriteria('chequebranch', this.chequebranchField.value);

    this.saleService.getAllBasic(new PageRequest()).then((saleDataPage) => {
      this.sales = saleDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.customerreturnService.getAll(pageRequest).then((page: CustomerreturnDataPage) => {
      this.customerreturnDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMERRETURN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERRETURNS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMERRETURN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMERRETURN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMERRETURN);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'sale', 'date', 'amount', 'paymenttype', 'paymentstatus', 'chequeno', 'chequedate', 'chequebank', 'chequebranch'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(customerreturn: Customerreturn): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: customerreturn.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.customerreturnService.delete(customerreturn.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
