import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Purchaseorder} from '../../../../entities/purchaseorder';
import {PurchaseorderService} from '../../../../services/purchaseorder.service';

@Component({
  selector: 'app-purchaseorder-detail',
  templateUrl: './purchaseorder-detail.component.html',
  styleUrls: ['./purchaseorder-detail.component.scss']
})
export class PurchaseorderDetailComponent extends AbstractComponent implements OnInit {

  purchaseorder: Purchaseorder;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private purchaseorderService: PurchaseorderService,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId = + params.get('id');
      try{
        await this.loadData();
      } finally {
        this.initialLoaded();
        this.refreshData();
      }
    });
  }

  async delete(): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: this.purchaseorder.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.purchaseorderService.delete(this.selectedId);
        await this.router.navigateByUrl('/purchaseorders');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.purchaseorder = await this.purchaseorderService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PURCHASEORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PURCHASEORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PURCHASEORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PURCHASEORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PURCHASEORDER);
  }
}
