import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {ItemService} from '../../../../services/item.service';
import {VehicleService} from '../../../../services/vehicle.service';
import {Vehicletype} from '../../../../entities/vehicletype';
import {FueltypeService} from '../../../../services/fueltype.service';
import {Transmissionservice} from '../../../../services/transmission.service';
import {Vehiclebrandservice} from '../../../../services/vehiclebrand.service';
import {Vehicletypeservice} from '../../../../services/vehicletype.service';
import {CustomerService} from '../../../../services/customer.service';
import {Vehiclebrand} from '../../../../entities/vehiclebrand';
import {Transmission} from '../../../../entities/transmission';
import {Fueltype} from '../../../../entities/fueltype';
import {PageRequest} from '../../../../shared/page-request';
import {Customer} from '../../../../entities/customer';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Item} from '../../../../entities/item';
import {ResourceLink} from '../../../../shared/resource-link';
import {Vehicle} from '../../../../entities/vehicle';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss']
})
export class VehicleFormComponent extends AbstractComponent implements OnInit {

  vehicletypes: Vehicletype[] = [];
  vehiclebrands: Vehiclebrand[] = [];
  transmissions: Transmission[] = [];
  fueltypes: Fueltype[] = [];
  customers: Customer[] = [];

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
    private snackBar: MatSnackBar,
    private router: Router
  ) { super(); }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();

    this.customerService.getAllBasic(new PageRequest()).then((customers) => {
      this.customers = customers.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  async loadData(): Promise<any>{
    this.updatePrivileges();
    if (!this.privilege.add) { return; }

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

  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_VEHICLE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_VEHICLES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_VEHICLE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_VEHICLE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_VEHICLE);
  }

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    if (this.form.invalid) { return; }

    const vehicle: Vehicle = new Vehicle();
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      vehicle.photo = photoIds[0];
    }else{
      vehicle.photo = null;
    }
    vehicle.no = this.noField.value;
    vehicle.vehicletype = this.vehicletypeField.value;
    vehicle.makeyear = this.makeyearField.value;
    vehicle.customer = this.customerField.value;
    vehicle.vehiclebrand = this.vehiclebrandField.value;
    vehicle.model = this.modelField.value;
    vehicle.transmission = this.transmissionField.value;
    vehicle.fueltype = this.fueltypeField.value;
    vehicle.description = this.descriptionField.value;

    try{
      const resourceLink: ResourceLink = await this.vehicleService.add(vehicle);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/vehicles/' + resourceLink.id);
      } else {
        this.form.reset();
        this.snackBar.open('Successfully saved', null, {duration: 2000});
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.no) { this.noField.setErrors({server: msg.no}); knownError = true; }
          if (msg.photo) { this.photoField.setErrors({server: msg.photo}); knownError = true; }
          if (msg.vehicletype) { this.vehicletypeField.setErrors({server: msg.vehicletype}); knownError = true; }
          if (msg.makeyear) { this.makeyearField.setErrors({server: msg.makeyear}); knownError = true; }
          if (msg.customer) { this.customerField.setErrors({server: msg.customer}); knownError = true; }
          if (msg.vehiclebrand) { this.vehiclebrandField.setErrors({server: msg.vehiclebrand}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.model) { this.modelField.setErrors({server: msg.model}); knownError = true; }
          if (msg.fueltype) { this.fueltypeField.setErrors({server: msg.fueltype}); knownError = true; }
          if (msg.transmission) { this.transmissionField.setErrors({server: msg.transmission}); knownError = true; }
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
