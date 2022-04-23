import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Supplier} from '../../../../entities/supplier';
import {Vehicle} from '../../../../entities/vehicle';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {VehicleService} from '../../../../services/vehicle.service';
import {Vehicletypeservice} from '../../../../services/vehicletype.service';
import {Vehiclebrandservice} from '../../../../services/vehiclebrand.service';
import {FueltypeService} from '../../../../services/fueltype.service';
import {Transmissionservice} from '../../../../services/transmission.service';
import {CustomerService} from '../../../../services/customer.service';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Customer} from '../../../../entities/customer';
import {Vehicletype} from '../../../../entities/vehicletype';
import {Vehiclebrand} from '../../../../entities/vehiclebrand';
import {Transmission} from '../../../../entities/transmission';
import {Fueltype} from '../../../../entities/fueltype';
import {Item} from '../../../../entities/item';
import {ResourceLink} from '../../../../shared/resource-link';

@Component({
  selector: 'app-vehicle-update-form',
  templateUrl: './vehicle-update-form.component.html',
  styleUrls: ['./vehicle-update-form.component.scss']
})
export class VehicleUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  vehicle: Vehicle;
  customers: Customer[];
  vehicletypes: Vehicletype[] = [];
  vehiclebrands: Vehiclebrand[] = [];
  transmissions: Transmission[] = [];
  fueltypes: Fueltype[] = [];

  form = new FormGroup({
    no: new FormControl(null, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(255),
    ]),
    photo: new FormControl(null, [
    ]),
    vehicletype: new FormControl(null, [
      Validators.required,
    ]),
    makeyear: new FormControl(null, [
      Validators.pattern('^([0-9]+)$')
    ]),
    customer: new FormControl(null, [
      Validators.required,
    ]),
    vehiclebrand: new FormControl(null, [
      Validators.required,
    ]),
    model: new FormControl(null, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(255),
    ]),
    transmission: new FormControl(null, [
      Validators.required,
    ]),
    fueltype: new FormControl(null, [
      Validators.required,
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });
  get noField(): FormControl{
    return this.form.controls.no as FormControl;
  }

  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }

  get vehicletypeField(): FormControl{
    return this.form.controls.vehicletype as FormControl;
  }

  get makeyearField(): FormControl{
    return this.form.controls.makeyear as FormControl;
  }

  get customerField(): FormControl{
    return this.form.controls.customer as FormControl;
  }
  get vehiclebrandField(): FormControl{
    return this.form.controls.vehiclebrand as FormControl;
  }
  get modelField(): FormControl{
    return this.form.controls.model as FormControl;
  }
  get fueltypeField(): FormControl{
    return this.form.controls.fueltype as FormControl;
  }
  get transmissionField(): FormControl{
    return this.form.controls.transmission as FormControl;
  }
  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }
  constructor(
    private vehicleService: VehicleService,
    private vehicletypeService: Vehicletypeservice,
    private vehiclebrandService: Vehiclebrandservice,
    private fueltypeService: FueltypeService,
    private transmissionservice: Transmissionservice,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) { super(); }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });

    this.customerService.getAllBasic(new PageRequest()).then((customers) => {
      this.customers = customers.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.vehicletypeService.getAll().then((vehicletypes) => {
      this.vehicletypes = vehicletypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.vehiclebrandService.getAll().then((vehiclebrands) => {
      this.vehiclebrands = vehiclebrands;
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
    this.vehicle = await this.vehicleService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_VEHICLE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_VEHICLES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_VEHICLE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_VEHICLE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_VEHICLE);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.noField.pristine) {
      this.noField.setValue(this.vehicle.no);
    }
    if (this.vehicletypeField.pristine) {
      this.vehicletypeField.setValue(this.vehicle.vehicletype.id);
    }
    if (this.makeyearField.pristine) {
      this.makeyearField.setValue(this.vehicle.makeyear);
    }
    if (this.photoField.pristine) {
      if (this.vehicle.photo) {
        this.photoField.setValue([this.vehicle.photo]);
      } else {
        this.photoField.setValue([]);
      }
    }
    if (this.vehiclebrandField.pristine) {
      this.vehiclebrandField.setValue(this.vehicle.vehiclebrand.id);
    }
    if (this.transmissionField.pristine) {
      this.transmissionField.setValue(this.vehicle.transmission.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.vehicle.description);
    }
    if (this.fueltypeField.pristine) {
      this.fueltypeField.setValue(this.vehicle.fueltype.id);
    }
    if (this.modelField.pristine) {
      this.modelField.setValue(this.vehicle.model);
    }
    if (this.customerField.pristine) {
      this.customerField.setValue(this.vehicle.customer.id);
    }
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newvehicle: Vehicle = new Vehicle();
    newvehicle.no = this.noField.value;
    newvehicle.fueltype = this.fueltypeField.value;
    newvehicle.customer = this.customerField.value;
    newvehicle.vehicletype = this.vehicletypeField.value;
    newvehicle.vehiclebrand = this.vehiclebrandField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      newvehicle.photo = photoIds[0];
    }else{
      newvehicle.photo = null;
    }
    newvehicle.transmission = this.transmissionField.value;
    newvehicle.model = this.modelField.value;
    newvehicle.description = this.descriptionField.value;
    newvehicle.makeyear = this.makeyearField.value;
    try{
      const resourceLink: ResourceLink = await this.vehicleService.update(this.selectedId, newvehicle);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/vehicles/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/vehicles');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.no) { this.noField.setErrors({server: msg.no}); knownError = true; }
          if (msg.model) { this.modelField.setErrors({server: msg.model}); knownError = true; }
          if (msg.makeyear) { this.makeyearField.setErrors({server: msg.makeyear}); knownError = true; }
          if (msg.vehicletype) { this.vehicletypeField.setErrors({server: msg.vehicletype}); knownError = true; }
          if (msg.photo) { this.photoField.setErrors({server: msg.photo}); knownError = true; }
          if (msg.vehiclebrand) { this.vehiclebrandField.setErrors({server: msg.vehiclebrand}); knownError = true; }
          if (msg.transmission) { this.transmissionField.setErrors({server: msg.transmission}); knownError = true; }
          if (msg.fueltype) { this.fueltypeField.setErrors({server: msg.fueltype}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.customer) { this.customerField.setErrors({server: msg.customer}); knownError = true; }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }

}
