import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {TokenManager} from '../../shared/security/token-manager';
import {AuthenticationService} from '../../shared/authentication.service';
import {LoggedUser} from '../../shared/logged-user';
import {LinkItem} from '../../shared/link-item';
import {ThemeManager} from '../../shared/views/theme-manager';
import {UsecaseList} from '../../usecase-list';
import {NotificationService} from '../../services/notification.service';
import {PrimeNumbers} from '../../shared/prime-numbers';
import {Notification} from '../../entities/notification';

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.scss']
})
export class MainWindowComponent implements OnInit, OnDestroy {

  constructor(
    private userService: UserService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService
  ) {
    if (!TokenManager.isContainsToken()){
      this.router.navigateByUrl('/login');
    }
  }

  get loggedUserName(): string{
    return LoggedUser.getName();
  }

  get loggedUserPhoto(): string{
    return LoggedUser.getPhoto();
  }

  refreshRate = PrimeNumbers.getRandomNumber();
  unreadNotificationCount = '0';
  isLive = true;
  sidenavOpen = false;
  sidenaveMode = 'side';
  usecasesLoaded = false;
  linkItems: LinkItem[] = [];
  isDark: boolean;
  latestNotifications: Notification[] = [];

  async loadData(): Promise<void>{
    this.notificationService.getUnreadCount().then((count) => {
      if (count > 99) { this.unreadNotificationCount = '99+'; }
      else{ this.unreadNotificationCount = count.toString(); }
    }).catch((e) => {
      console.log(e);
    });

    this.notificationService.getLatest().then(async (data) => {
      this.latestNotifications = data;
      for (const notification of data){
        if (!notification.dodelivered){
          await this.notificationService.setDelivered(notification.id);
        }
      }
    }).catch((e) => {
      console.log(e);
    });

  }

  setNotificationsAsRead(): void{
    for (const notification of this.latestNotifications){
      if (!notification.doread){
        this.notificationService.setRead(notification.id);
      }
    }
  }

  refreshData(): void{
    setTimeout( async () => {
      if (!this.isLive) { return; }
      try{
        await this.loadData();
      }finally {
        this.refreshData();
      }
    }, this.refreshRate);
  }

  async ngOnInit(): Promise<void> {
    this.userService.me().then((user) => {
      LoggedUser.user = user;
    });
    this.userService.myUsecases().then((usecases) => {
      LoggedUser.usecases = usecases;
      this.setLinkItems();
      this.usecasesLoaded = true;
    });
    this.setSidenavSettings();
    this.isDark = ThemeManager.isDark();
    await this.loadData();
    this.refreshData();
  }

  async logout(): Promise<void>{
    await this.authenticationService.destroyToken();
    TokenManager.destroyToken();
    LoggedUser.clear();
    this.router.navigateByUrl('/login');
  }

  setSidenavSettings(): void{
    const width = window.innerWidth;
    if (width < 992){
      this.sidenavOpen = false;
      this.sidenaveMode = 'over';
    }else{
      this.sidenavOpen = true;
      this.sidenaveMode = 'side';
    }
  }

  private setLinkItems(): void{
    const dashboardLink = new LinkItem('Dashboard', '/', 'dashboard');
    const userLink = new LinkItem('User Management', '', 'admin_panel_settings');
    const roleLink = new LinkItem('Role Management', '', 'assignment_ind');

    const saleLink = new LinkItem('Sale Management', '/', 'trip_origin');
    const purchaseLink = new LinkItem('Purchase Management', '/', 'trip_origin');
    const customerLink = new LinkItem('Customer Management', '/', 'trip_origin');
    const disposalLink = new LinkItem('Disposal Management', '/', 'trip_origin');
    const customerreturnLink = new LinkItem('Customerreturn Management', '/', 'trip_origin');
    const vehicleLink = new LinkItem('Vehicle Management', '/', 'trip_origin');
    const itemLink = new LinkItem('Item Management', '/', 'trip_origin');
    const supplierpaymentLink = new LinkItem('Supplierpayment Management', '/', 'trip_origin');
    const employeeLink = new LinkItem('Employee Management', '/', 'trip_origin');
    const supplierreturnLink = new LinkItem('Supplierreturn Management', '/', 'trip_origin');
    const purchaseorderLink = new LinkItem('Purchaseorder Management', '/', 'trip_origin');
    const supplierLink = new LinkItem('Supplier Management', '/', 'trip_origin');
    const customerpaymentLink = new LinkItem('Customerpayment Management', '/', 'trip_origin');

    const showUserLink = new LinkItem('Show All Users', '/users', 'list');
    showUserLink.addUsecaseId(UsecaseList.SHOW_ALL_USERS);
    userLink.children.push(showUserLink);

    const addUserLink = new LinkItem('Add New User', '/users/add', 'add');
    addUserLink.addUsecaseId(UsecaseList.ADD_USER);
    userLink.children.push(addUserLink);

    const showRoleLink = new LinkItem('Show All Roles', '/roles', 'list');
    showRoleLink.addUsecaseId(UsecaseList.SHOW_ALL_ROLES);
    roleLink.children.push(showRoleLink);

    const addRoleLink = new LinkItem('Add New Role', '/roles/add', 'add');
    addRoleLink.addUsecaseId(UsecaseList.ADD_ROLE);
    roleLink.children.push(addRoleLink);

    const addNewSaleLink = new LinkItem('Add New Sale', 'sales/add', 'add');
    addNewSaleLink.addUsecaseId(UsecaseList.ADD_SALE);
    saleLink.children.push(addNewSaleLink);

    const showAllSaleLink = new LinkItem('Show All Sale', 'sales', 'list');
    showAllSaleLink.addUsecaseId(UsecaseList.SHOW_ALL_SALES);
    saleLink.children.push(showAllSaleLink);

    const addNewPurchaseLink = new LinkItem('Add New Purchase', 'purchases/add', 'add');
    addNewPurchaseLink.addUsecaseId(UsecaseList.ADD_PURCHASE);
    purchaseLink.children.push(addNewPurchaseLink);

    const showAllPurchaseLink = new LinkItem('Show All Purchase', 'purchases', 'list');
    showAllPurchaseLink.addUsecaseId(UsecaseList.SHOW_ALL_PURCHASES);
    purchaseLink.children.push(showAllPurchaseLink);

    const addNewCustomerLink = new LinkItem('Add New Customer', 'customers/add', 'add');
    addNewCustomerLink.addUsecaseId(UsecaseList.ADD_CUSTOMER);
    customerLink.children.push(addNewCustomerLink);

    const showAllCustomerLink = new LinkItem('Show All Customer', 'customers', 'list');
    showAllCustomerLink.addUsecaseId(UsecaseList.SHOW_ALL_CUSTOMERS);
    customerLink.children.push(showAllCustomerLink);

    const addNewDisposalLink = new LinkItem('Add New Disposal', 'disposals/add', 'add');
    addNewDisposalLink.addUsecaseId(UsecaseList.ADD_DISPOSAL);
    disposalLink.children.push(addNewDisposalLink);

    const showAllDisposalLink = new LinkItem('Show All Disposal', 'disposals', 'list');
    showAllDisposalLink.addUsecaseId(UsecaseList.SHOW_ALL_DISPOSALS);
    disposalLink.children.push(showAllDisposalLink);

    const addNewCustomerreturnLink = new LinkItem('Add New Customerreturn', 'customerreturns/add', 'add');
    addNewCustomerreturnLink.addUsecaseId(UsecaseList.ADD_CUSTOMERRETURN);
    customerreturnLink.children.push(addNewCustomerreturnLink);

    const showAllCustomerreturnLink = new LinkItem('Show All Customerreturn', 'customerreturns', 'list');
    showAllCustomerreturnLink.addUsecaseId(UsecaseList.SHOW_ALL_CUSTOMERRETURNS);
    customerreturnLink.children.push(showAllCustomerreturnLink);

    const addNewVehicleLink = new LinkItem('Add New Vehicle', 'Fvehicles/add', 'add');
    addNewVehicleLink.addUsecaseId(UsecaseList.ADD_VEHICLE);
    vehicleLink.children.push(addNewVehicleLink);

    const showAllVehicleLink = new LinkItem('Show All Vehicle', 'vehicles', 'list');
    showAllVehicleLink.addUsecaseId(UsecaseList.SHOW_ALL_VEHICLES);
    vehicleLink.children.push(showAllVehicleLink);

    const addNewItemLink = new LinkItem('Add New Item', 'items/add', 'add');
    addNewItemLink.addUsecaseId(UsecaseList.ADD_ITEM);
    itemLink.children.push(addNewItemLink);

    const showAllItemLink = new LinkItem('Show All Item', 'items', 'list');
    showAllItemLink.addUsecaseId(UsecaseList.SHOW_ALL_ITEMS);
    itemLink.children.push(showAllItemLink);

    const addNewSupplierpaymentLink = new LinkItem('Add New Supplierpayment', 'supplierpayments/add', 'add');
    addNewSupplierpaymentLink.addUsecaseId(UsecaseList.ADD_SUPPLIERPAYMENT);
    supplierpaymentLink.children.push(addNewSupplierpaymentLink);

    const showAllSupplierpaymentLink = new LinkItem('Show All Supplierpayment', 'supplierpayments', 'list');
    showAllSupplierpaymentLink.addUsecaseId(UsecaseList.SHOW_ALL_SUPPLIERPAYMENTS);
    supplierpaymentLink.children.push(showAllSupplierpaymentLink);

    const addNewEmployeeLink = new LinkItem('Add New Employee', 'employees/add', 'add');
    addNewEmployeeLink.addUsecaseId(UsecaseList.ADD_EMPLOYEE);
    employeeLink.children.push(addNewEmployeeLink);

    const showAllEmployeeLink = new LinkItem('Show All Employee', 'employees', 'list');
    showAllEmployeeLink.addUsecaseId(UsecaseList.SHOW_ALL_EMPLOYEES);
    employeeLink.children.push(showAllEmployeeLink);

    const addNewSupplierreturnLink = new LinkItem('Add New Supplierreturn', 'supplierreturns/add', 'add');
    addNewSupplierreturnLink.addUsecaseId(UsecaseList.ADD_SUPPLIERRETURN);
    supplierreturnLink.children.push(addNewSupplierreturnLink);

    const showAllSupplierreturnLink = new LinkItem('Show All Supplierreturn', 'supplierreturns', 'list');
    showAllSupplierreturnLink.addUsecaseId(UsecaseList.SHOW_ALL_SUPPLIERRETURNS);
    supplierreturnLink.children.push(showAllSupplierreturnLink);

    const addNewPurchaseorderLink = new LinkItem('Add New Purchaseorder', 'purchaseorders/add', 'add');
    addNewPurchaseorderLink.addUsecaseId(UsecaseList.ADD_PURCHASEORDER);
    purchaseorderLink.children.push(addNewPurchaseorderLink);

    const showAllPurchaseorderLink = new LinkItem('Show All Purchaseorder', 'purchaseorders', 'list');
    showAllPurchaseorderLink.addUsecaseId(UsecaseList.SHOW_ALL_PURCHASEORDERS);
    purchaseorderLink.children.push(showAllPurchaseorderLink);

    const addNewSupplierLink = new LinkItem('Add New Supplier', 'suppliers/add', 'add');
    addNewSupplierLink.addUsecaseId(UsecaseList.ADD_SUPPLIER);
    supplierLink.children.push(addNewSupplierLink);

    const showAllSupplierLink = new LinkItem('Show All Supplier', 'suppliers', 'list');
    showAllSupplierLink.addUsecaseId(UsecaseList.SHOW_ALL_SUPPLIERS);
    supplierLink.children.push(showAllSupplierLink);

    const addNewCustomerpaymentLink = new LinkItem('Add New Customerpayment', 'customerpayments/add', 'add');
    addNewCustomerpaymentLink.addUsecaseId(UsecaseList.ADD_CUSTOMERPAYMENT);
    customerpaymentLink.children.push(addNewCustomerpaymentLink);

    const showAllCustomerpaymentLink = new LinkItem('Show All Customerpayment', 'customerpayments', 'list');
    showAllCustomerpaymentLink.addUsecaseId(UsecaseList.SHOW_ALL_CUSTOMERPAYMENTS);
    customerpaymentLink.children.push(showAllCustomerpaymentLink);

    this.linkItems.push(dashboardLink);
    this.linkItems.push(userLink);
    this.linkItems.push(roleLink);
    this.linkItems.push(saleLink);
    this.linkItems.push(purchaseLink);
    this.linkItems.push(customerLink);
    this.linkItems.push(disposalLink);
    this.linkItems.push(customerreturnLink);
    this.linkItems.push(vehicleLink);
    this.linkItems.push(itemLink);
    this.linkItems.push(supplierpaymentLink);
    this.linkItems.push(employeeLink);
    this.linkItems.push(supplierreturnLink);
    this.linkItems.push(purchaseorderLink);
    this.linkItems.push(supplierLink);
    this.linkItems.push(customerpaymentLink);

  }

  changeTheme(e): void{
    if (e.checked){
      ThemeManager.setDark(true);
      this.isDark = true;
    }else{
      ThemeManager.setDark(false);
      this.isDark = false;
    }
  }

  ngOnDestroy(): void {
    this.isLive = false;
  }
}
