import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Customerpayment, CustomerpaymentDataPage} from '../../../../entities/customerpayment';
import {CustomerpaymentService} from '../../../../services/customerpayment.service';
import {Paymenttype} from '../../../../entities/paymenttype';
import {Paymentstatus} from '../../../../entities/paymentstatus';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {PaymentstatusService} from '../../../../services/paymentstatus.service';

@Component({
  selector: 'app-customerpayment-table',
  templateUrl: './customerpayment-table.component.html',
  styleUrls: ['./customerpayment-table.component.scss']
})
export class CustomerpaymentTableComponent extends AbstractComponent implements OnInit {

  customerpaymentDataPage: CustomerpaymentDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  paymenttypes: Paymenttype[] = [];
  paymentstatuses: Paymentstatus[] = [];

  codeField = new FormControl();
  chequenoField = new FormControl();
  chequebankField = new FormControl();
  chequebranchField = new FormControl();
  paymenttypeField = new FormControl();
  paymentstatusField = new FormControl();

  constructor(
    private paymenttypeService: PaymenttypeService,
    private paymentstatusService: PaymentstatusService,
    private customerpaymentService: CustomerpaymentService,
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
    pageRequest.addSearchCriteria('chequeno', this.chequenoField.value);
    pageRequest.addSearchCriteria('chequebank', this.chequebankField.value);
    pageRequest.addSearchCriteria('chequebranch', this.chequebranchField.value);
    pageRequest.addSearchCriteria('paymenttype', this.paymenttypeField.value);
    pageRequest.addSearchCriteria('paymentstatus', this.paymentstatusField.value);


    this.customerpaymentService.getAll(pageRequest).then((page: CustomerpaymentDataPage) => {
      this.customerpaymentDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMERPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMERPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMERPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMERPAYMENT);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'amount', 'date', 'chequeno', 'chequedate', 'chequebank', 'chequebranch', 'paymenttype', 'paymentstatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(customerpayment: Customerpayment): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: customerpayment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.customerpaymentService.delete(customerpayment.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
