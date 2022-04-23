import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Item, ItemDataPage} from '../../../../entities/item';
import {ItemService} from '../../../../services/item.service';
import {Unit} from '../../../../entities/unit';
import {Itemstatus} from '../../../../entities/itemstatus';
import {UnitService} from '../../../../services/unit.service';
import {Itemcategory} from '../../../../entities/itemcategory';
import {ItemstatusService} from '../../../../services/itemstatus.service';
import {ItemcategoryService} from '../../../../services/itemcategory.service';

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.scss']
})
export class ItemTableComponent extends AbstractComponent implements OnInit {

  itemDataPage: ItemDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  itemcategories: Itemcategory[] = [];
  units: Unit[] = [];
  itemstatuses: Itemstatus[] = [];

  codeField = new FormControl();
  nameField = new FormControl();
  itemcategoryField = new FormControl();
  unitField = new FormControl();
  itemstatusField = new FormControl();

  constructor(
    private itemcategoryService: ItemcategoryService,
    private unitService: UnitService,
    private itemstatusService: ItemstatusService,
    private itemService: ItemService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
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
    this.itemstatusService.getAll().then((itemstatuses) => {
      this.itemstatuses = itemstatuses;
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
    pageRequest.addSearchCriteria('itemcategory', this.itemcategoryField.value);
    pageRequest.addSearchCriteria('unit', this.unitField.value);
    pageRequest.addSearchCriteria('itemstatus', this.itemstatusField.value);


    this.itemService.getAll(pageRequest).then((page: ItemDataPage) => {
      this.itemDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ITEM);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ITEMS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ITEM_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ITEM);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ITEM);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'name', 'itemcategory', 'unit', 'photo', 'itemstatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(item: Item): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: item.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.itemService.delete(item.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
