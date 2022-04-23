import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Supplierreturn} from '../../../../entities/supplierreturn';
import {SupplierreturnService} from '../../../../services/supplierreturn.service';

@Component({
  selector: 'app-supplierreturn-detail',
  templateUrl: './supplierreturn-detail.component.html',
  styleUrls: ['./supplierreturn-detail.component.scss']
})
export class SupplierreturnDetailComponent extends AbstractComponent implements OnInit {

  supplierreturn: Supplierreturn;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private supplierreturnService: SupplierreturnService,
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
      data: {message: this.supplierreturn.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.supplierreturnService.delete(this.selectedId);
        await this.router.navigateByUrl('/supplierreturns');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.supplierreturn = await this.supplierreturnService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIERRETURN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SUPPLIERRETURNS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SUPPLIERRETURN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIERRETURN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIERRETURN);
  }
}
