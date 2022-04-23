import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Customerreturn} from '../../../../entities/customerreturn';
import {CustomerreturnService} from '../../../../services/customerreturn.service';

@Component({
  selector: 'app-customerreturn-detail',
  templateUrl: './customerreturn-detail.component.html',
  styleUrls: ['./customerreturn-detail.component.scss']
})
export class CustomerreturnDetailComponent extends AbstractComponent implements OnInit {

  customerreturn: Customerreturn;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private customerreturnService: CustomerreturnService,
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
      data: {message: this.customerreturn.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.customerreturnService.delete(this.selectedId);
        await this.router.navigateByUrl('/customerreturns');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.customerreturn = await this.customerreturnService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMERRETURN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERRETURNS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMERRETURN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMERRETURN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMERRETURN);
  }
}
