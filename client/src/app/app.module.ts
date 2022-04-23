import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './views/login/login.component';
import { MainWindowComponent } from './views/main-window/main-window.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { PageHeaderComponent } from './shared/views/page-header/page-header.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {Interceptor} from './shared/interceptor';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTreeModule} from '@angular/material/tree';
import { NavigationComponent } from './shared/views/navigation/navigation.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { RoleDetailComponent } from './views/modules/role/role-detail/role-detail.component';
import { RoleFormComponent } from './views/modules/role/role-form/role-form.component';
import { RoleTableComponent } from './views/modules/role/role-table/role-table.component';
import { RoleUpdateFormComponent } from './views/modules/role/role-update-form/role-update-form.component';
import { UserDetailComponent } from './views/modules/user/user-detail/user-detail.component';
import { UserFormComponent } from './views/modules/user/user-form/user-form.component';
import { UserTableComponent } from './views/modules/user/user-table/user-table.component';
import { UserUpdateFormComponent } from './views/modules/user/user-update-form/user-update-form.component';
import { ChangePasswordComponent } from './views/modules/user/change-password/change-password.component';
import { ResetPasswordComponent } from './views/modules/user/reset-password/reset-password.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from './shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { EmptyDataTableComponent } from './shared/views/empty-data-table/empty-data-table.component';
import { LoginTimeOutDialogComponent } from './shared/views/login-time-out-dialog/login-time-out-dialog.component';
import { Nl2brPipe } from './shared/nl2br.pipe';
import { NoPrivilegeComponent } from './shared/views/no-privilege/no-privilege.component';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import { AdminConfigurationComponent } from './views/admin-configuration/admin-configuration.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ObjectNotFoundComponent } from './shared/views/object-not-found/object-not-found.component';
import { LoadingComponent } from './shared/views/loading/loading.component';
import { ConfirmDialogComponent } from './shared/views/confirm-dialog/confirm-dialog.component';
import {MatTabsModule} from '@angular/material/tabs';
import { DualListboxComponent } from './shared/ui-components/dual-listbox/dual-listbox.component';
import {FileChooserComponent} from './shared/ui-components/file-chooser/file-chooser.component';
import { ChangePhotoComponent } from './views/modules/user/change-photo/change-photo.component';
import { MyAllNotificationComponent } from './views/modules/user/my-all-notification/my-all-notification.component';
import {PurchaseitemSubFormComponent} from './views/modules/purchase/purchase-form/purchaseitem-sub-form/purchaseitem-sub-form.component';
import {SupplierreturnitemSubFormComponent} from './views/modules/supplierreturn/supplierreturn-form/supplierreturnitem-sub-form/supplierreturnitem-sub-form.component';
import {CustomerpaymentTableComponent} from './views/modules/customerpayment/customerpayment-table/customerpayment-table.component';
import {CustomerpaymentFormComponent} from './views/modules/customerpayment/customerpayment-form/customerpayment-form.component';
import {CustomerpaymentDetailComponent} from './views/modules/customerpayment/customerpayment-detail/customerpayment-detail.component';
import {CustomerpaymentUpdateFormComponent} from './views/modules/customerpayment/customerpayment-update-form/customerpayment-update-form.component';
import {EmployeeTableComponent} from './views/modules/employee/employee-table/employee-table.component';
import {EmployeeFormComponent} from './views/modules/employee/employee-form/employee-form.component';
import {EmployeeDetailComponent} from './views/modules/employee/employee-detail/employee-detail.component';
import {EmployeeUpdateFormComponent} from './views/modules/employee/employee-update-form/employee-update-form.component';
import {CustomerreturnitemSubFormComponent} from './views/modules/customerreturn/customerreturn-form/customerreturnitem-sub-form/customerreturnitem-sub-form.component';
import {DisposalTableComponent} from './views/modules/disposal/disposal-table/disposal-table.component';
import {DisposalFormComponent} from './views/modules/disposal/disposal-form/disposal-form.component';
import {DisposalDetailComponent} from './views/modules/disposal/disposal-detail/disposal-detail.component';
import {DisposalUpdateFormComponent} from './views/modules/disposal/disposal-update-form/disposal-update-form.component';
import {SupplierpaymentTableComponent} from './views/modules/supplierpayment/supplierpayment-table/supplierpayment-table.component';
import {SupplierpaymentFormComponent} from './views/modules/supplierpayment/supplierpayment-form/supplierpayment-form.component';
import {SupplierpaymentDetailComponent} from './views/modules/supplierpayment/supplierpayment-detail/supplierpayment-detail.component';
import {SupplierpaymentUpdateFormComponent} from './views/modules/supplierpayment/supplierpayment-update-form/supplierpayment-update-form.component';
import {SaleitemUpdateSubFormComponent} from './views/modules/sale/sale-update-form/saleitem-update-sub-form/saleitem-update-sub-form.component';
import {DisposalitemSubFormComponent} from './views/modules/disposal/disposal-form/disposalitem-sub-form/disposalitem-sub-form.component';
import {PurchaseorderTableComponent} from './views/modules/purchaseorder/purchaseorder-table/purchaseorder-table.component';
import {PurchaseorderFormComponent} from './views/modules/purchaseorder/purchaseorder-form/purchaseorder-form.component';
import {PurchaseorderDetailComponent} from './views/modules/purchaseorder/purchaseorder-detail/purchaseorder-detail.component';
import {PurchaseorderUpdateFormComponent} from './views/modules/purchaseorder/purchaseorder-update-form/purchaseorder-update-form.component';
import {PurchaseitemUpdateSubFormComponent} from './views/modules/purchase/purchase-update-form/purchaseitem-update-sub-form/purchaseitem-update-sub-form.component';
import {SupplierTableComponent} from './views/modules/supplier/supplier-table/supplier-table.component';
import {SupplierFormComponent} from './views/modules/supplier/supplier-form/supplier-form.component';
import {SupplierDetailComponent} from './views/modules/supplier/supplier-detail/supplier-detail.component';
import {SupplierUpdateFormComponent} from './views/modules/supplier/supplier-update-form/supplier-update-form.component';
import {ItemTableComponent} from './views/modules/item/item-table/item-table.component';
import {ItemFormComponent} from './views/modules/item/item-form/item-form.component';
import {ItemDetailComponent} from './views/modules/item/item-detail/item-detail.component';
import {ItemUpdateFormComponent} from './views/modules/item/item-update-form/item-update-form.component';
import {PurchaseTableComponent} from './views/modules/purchase/purchase-table/purchase-table.component';
import {PurchaseFormComponent} from './views/modules/purchase/purchase-form/purchase-form.component';
import {PurchaseDetailComponent} from './views/modules/purchase/purchase-detail/purchase-detail.component';
import {PurchaseUpdateFormComponent} from './views/modules/purchase/purchase-update-form/purchase-update-form.component';
import {PurchaseorderitemUpdateSubFormComponent} from './views/modules/purchaseorder/purchaseorder-update-form/purchaseorderitem-update-sub-form/purchaseorderitem-update-sub-form.component';
import {SaleTableComponent} from './views/modules/sale/sale-table/sale-table.component';
import {SaleFormComponent} from './views/modules/sale/sale-form/sale-form.component';
import {SaleDetailComponent} from './views/modules/sale/sale-detail/sale-detail.component';
import {SaleUpdateFormComponent} from './views/modules/sale/sale-update-form/sale-update-form.component';
import {CustomerreturnitemUpdateSubFormComponent} from './views/modules/customerreturn/customerreturn-update-form/customerreturnitem-update-sub-form/customerreturnitem-update-sub-form.component';
import {DisposalitemUpdateSubFormComponent} from './views/modules/disposal/disposal-update-form/disposalitem-update-sub-form/disposalitem-update-sub-form.component';
import {CustomerreturnTableComponent} from './views/modules/customerreturn/customerreturn-table/customerreturn-table.component';
import {CustomerreturnFormComponent} from './views/modules/customerreturn/customerreturn-form/customerreturn-form.component';
import {CustomerreturnDetailComponent} from './views/modules/customerreturn/customerreturn-detail/customerreturn-detail.component';
import {CustomerreturnUpdateFormComponent} from './views/modules/customerreturn/customerreturn-update-form/customerreturn-update-form.component';
import {PurchaseorderitemSubFormComponent} from './views/modules/purchaseorder/purchaseorder-form/purchaseorderitem-sub-form/purchaseorderitem-sub-form.component';
import {SaleitemSubFormComponent} from './views/modules/sale/sale-form/saleitem-sub-form/saleitem-sub-form.component';
import {SupplierreturnitemUpdateSubFormComponent} from './views/modules/supplierreturn/supplierreturn-update-form/supplierreturnitem-update-sub-form/supplierreturnitem-update-sub-form.component';
import {SupplierreturnTableComponent} from './views/modules/supplierreturn/supplierreturn-table/supplierreturn-table.component';
import {SupplierreturnFormComponent} from './views/modules/supplierreturn/supplierreturn-form/supplierreturn-form.component';
import {SupplierreturnDetailComponent} from './views/modules/supplierreturn/supplierreturn-detail/supplierreturn-detail.component';
import {SupplierreturnUpdateFormComponent} from './views/modules/supplierreturn/supplierreturn-update-form/supplierreturn-update-form.component';
import {CustomerTableComponent} from './views/modules/customer/customer-table/customer-table.component';
import {CustomerFormComponent} from './views/modules/customer/customer-form/customer-form.component';
import {CustomerDetailComponent} from './views/modules/customer/customer-detail/customer-detail.component';
import {CustomerUpdateFormComponent} from './views/modules/customer/customer-update-form/customer-update-form.component';
import { VehicleFormComponent } from './views/modules/vehicle/vehicle-form/vehicle-form.component';
import { VehicleTableComponent } from './views/modules/vehicle/vehicle-table/vehicle-table.component';
import { VehicleDetailComponent } from './views/modules/vehicle/vehicle-detail/vehicle-detail.component';
import { VehicleUpdateFormComponent } from './views/modules/vehicle/vehicle-update-form/vehicle-update-form.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        MainWindowComponent,
        DashboardComponent,
        PageNotFoundComponent,
        PageHeaderComponent,
        NavigationComponent,
        RoleDetailComponent,
        RoleFormComponent,
        RoleTableComponent,
        RoleUpdateFormComponent,
        UserDetailComponent,
        UserFormComponent,
        UserTableComponent,
        UserUpdateFormComponent,
        ChangePasswordComponent,
        ResetPasswordComponent,
        DeleteConfirmDialogComponent,
        EmptyDataTableComponent,
        LoginTimeOutDialogComponent,
        Nl2brPipe,
        NoPrivilegeComponent,
        AdminConfigurationComponent,
        FileChooserComponent,
        ObjectNotFoundComponent,
        LoadingComponent,
        ConfirmDialogComponent,
        DualListboxComponent,
        ChangePhotoComponent,
        MyAllNotificationComponent,
        PurchaseitemSubFormComponent,
        SupplierreturnitemSubFormComponent,
        CustomerpaymentTableComponent,
        CustomerpaymentFormComponent,
        CustomerpaymentDetailComponent,
        CustomerpaymentUpdateFormComponent,
        EmployeeTableComponent,
        EmployeeFormComponent,
        EmployeeDetailComponent,
        EmployeeUpdateFormComponent,
        CustomerreturnitemSubFormComponent,
        DisposalTableComponent,
        DisposalFormComponent,
        DisposalDetailComponent,
        DisposalUpdateFormComponent,
        SupplierpaymentTableComponent,
        SupplierpaymentFormComponent,
        SupplierpaymentDetailComponent,
        SupplierpaymentUpdateFormComponent,
        SaleitemUpdateSubFormComponent,
        DisposalitemSubFormComponent,
        PurchaseorderTableComponent,
        PurchaseorderFormComponent,
        PurchaseorderDetailComponent,
        PurchaseorderUpdateFormComponent,
        PurchaseitemUpdateSubFormComponent,
        SupplierTableComponent,
        SupplierFormComponent,
        SupplierDetailComponent,
        SupplierUpdateFormComponent,
        ItemTableComponent,
        ItemFormComponent,
        ItemDetailComponent,
        ItemUpdateFormComponent,
        PurchaseTableComponent,
        PurchaseFormComponent,
        PurchaseDetailComponent,
        PurchaseUpdateFormComponent,
        PurchaseorderitemUpdateSubFormComponent,
        SaleTableComponent,
        SaleFormComponent,
        SaleDetailComponent,
        SaleUpdateFormComponent,
        CustomerreturnitemUpdateSubFormComponent,
        DisposalitemUpdateSubFormComponent,
        CustomerreturnTableComponent,
        CustomerreturnFormComponent,
        CustomerreturnDetailComponent,
        CustomerreturnUpdateFormComponent,
        PurchaseorderitemSubFormComponent,
        SaleitemSubFormComponent,
        SupplierreturnitemUpdateSubFormComponent,
        SupplierreturnTableComponent,
        SupplierreturnFormComponent,
        SupplierreturnDetailComponent,
        SupplierreturnUpdateFormComponent,
        CustomerTableComponent,
        CustomerFormComponent,
        CustomerDetailComponent,
        CustomerUpdateFormComponent,
      VehicleFormComponent,
      VehicleTableComponent,
      VehicleDetailComponent,
      VehicleUpdateFormComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    HttpClientModule,
    MatSidenavModule,
    MatBadgeModule,
    MatTooltipModule,
    MatListModule,
    MatExpansionModule,
    MatGridListModule,
    MatTreeModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatTabsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
