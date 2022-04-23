import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Customerpayment} from '../../../../entities/customerpayment';
import {CustomerpaymentService} from '../../../../services/customerpayment.service';

@Component({
  selector: 'app-customerpayment-detail',
  templateUrl: './customerpayment-detail.component.html',
  styleUrls: ['./customerpayment-detail.component.scss']
})
export class CustomerpaymentDetailComponent extends AbstractComponent implements OnInit {

  customerpayment: Customerpayment;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private customerpaymentService: CustomerpaymentService,
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
      data: {message: this.customerpayment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.customerpaymentService.delete(this.selectedId);
        await this.router.navigateByUrl('/customerpayments');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.customerpayment = await this.customerpaymentService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMERPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CUSTOMERPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CUSTOMERPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMERPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMERPAYMENT);
  }
}
