import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Vehicletype} from '../../../../entities/vehicletype';
import {Vehiclebrand} from '../../../../entities/vehiclebrand';
import {Transmission} from '../../../../entities/transmission';
import {Fueltype} from '../../../../entities/fueltype';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {VehicleService} from '../../../../services/vehicle.service';
import {Vehicletypeservice} from '../../../../services/vehicletype.service';
import {Vehiclebrandservice} from '../../../../services/vehiclebrand.service';
import {FueltypeService} from '../../../../services/fueltype.service';
import {Transmissionservice} from '../../../../services/transmission.service';
import {PageRequest} from '../../../../shared/page-request';
import {Vehicle, VehicleDataPage} from '../../../../entities/vehicle';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-vehicle-table',
  templateUrl: './vehicle-table.component.html',
  styleUrls: ['./vehicle-table.component.scss']
})
export class VehicleTableComponent extends AbstractComponent implements OnInit {

  vehicleDataPage: VehicleDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  vehicletypes: Vehicletype[] = [];
  vehiclebrands: Vehiclebrand[] = [];
  transmissions: Transmission[] = [];
  fueltypes: Fueltype[] = [];

  noField = new FormControl();
  modelField = new FormControl();
  vehicletypeField = new FormControl();
  vehiclebrandField = new FormControl();
  transmissionField = new FormControl();
  fueltypeField = new FormControl();

  constructor(
    private vehicleService: VehicleService,
    private vehicletypeService: Vehicletypeservice,
    private vehiclebrandService: Vehiclebrandservice,
    private fueltypeService: FueltypeService,
    private transmissionservice: Transmissionservice,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { super(); }

  async ngOnInit(): Promise<any> {
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

    pageRequest.addSearchCriteria('no', this.noField.value);
    pageRequest.addSearchCriteria('model', this.modelField.value);
    pageRequest.addSearchCriteria('vehiclebrand', this.vehiclebrandField.value);
    pageRequest.addSearchCriteria('vehicletype', this.vehicletypeField.value);
    pageRequest.addSearchCriteria('fueltype', this.fueltypeField.value);
    pageRequest.addSearchCriteria('transmission', this.transmissionField.value);

    this.vehiclebrandService.getAll().then((vehiclebrands) => {
      this.vehiclebrands = vehiclebrands;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.vehicletypeService.getAll().then((vehicletypes) => {
      this.vehicletypes = vehicletypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.transmissionservice.getAll().then((transmissions) => {
      this.transmissions = transmissions;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.fueltypeService.getAll().then((fueltypes) => {
      this.fueltypes = fueltypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.vehicleService.getAll(pageRequest).then((page: VehicleDataPage) => {
      this.vehicleDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_VEHICLE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_VEHICLES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_VEHICLE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_VEHICLE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_VEHICLE);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['photo' , 'no', 'model' , 'customer', 'vehiclebrand', 'vehicletype' , 'fueltype', 'transmission' , 'makeyear'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(vehicle: Vehicle): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: vehicle.code + ' - ' + vehicle.no}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.vehicleService.delete(vehicle.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
