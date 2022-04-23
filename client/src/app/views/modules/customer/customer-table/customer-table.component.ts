import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Customer, CustomerDataPage} from '../../../../entities/customer';
import {CustomerService} from '../../../../services/customer.service';
import {Customerstatus} from '../../../../entities/customerstatus';
import {CustomerstatusService} from '../../../../services/customerstatus.service';

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.scss']
})
export class CustomerTableComponent extends AbstractComponent implements OnInit {

  customerDataPage: CustomerDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  customerstatuses: Customerstatus[] = [];

  codeField = new FormControl();
  nameField = new FormControl();
  nicField = new FormControl();
  customerstatusField = new FormControl();

  constructor(
    private customerstatusService: CustomerstatusService,
    private customerService: CustomerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.customerstatusService.getAll().then((customerstatuses) => {
      this.customerstatuses = customerstatuses;
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
    pageRequest.addSearchCriteria('nic', this.nicField.value);
    pageRequest.addSearchCriteria('customerstatus', this.customerstatusField.value);


    this.customerService.getAll(pageRequest).then((page: CustomerDataPage) => {
      this.customerDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMER);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'name', 'nic', 'customerstatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(customer: Customer): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: customer.code + ' ' + customer.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.customerService.delete(customer.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
