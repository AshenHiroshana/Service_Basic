-- drop database if exist
DROP DATABASE IF EXISTS `supermarket`;


-- create new database
CREATE DATABASE `supermarket`;
USE `supermarket`;


-- set max allowed packet size
set global max_allowed_packet = 64000000;


-- table definitions
CREATE TABLE `civilstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `customerstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `designation`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `employeestatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `gender`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(10) NULL
);

CREATE TABLE `itemcategory`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NULL
);

CREATE TABLE `itemstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `nametitle`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(10) NULL
);

CREATE TABLE `paymentstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `paymenttype`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `purchaseorderstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `purchasestatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `saletype`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `supplierstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `unit`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `vehiclestatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `vehicletype`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `customer`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `nametitle_id` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `nic` VARCHAR(12) NOT NULL,
    `contact1` CHAR(10) NOT NULL,
    `contact2` CHAR(10) NULL,
    `email` VARCHAR(255) NULL,
    `address` TEXT NOT NULL,
    `creditlimit` DECIMAL(10,2) NULL,
    `description` TEXT NULL,
    `customerstatus_id` INT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `customerpayment`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `date` DATE NOT NULL,
    `chequeno` VARCHAR(255) NOT NULL,
    `chequedate` DATE NOT NULL,
    `chequebank` VARCHAR(255) NOT NULL,
    `chequebranch` VARCHAR(255) NOT NULL,
    `sale_id` INT NOT NULL,
    `paymenttype_id` INT NOT NULL,
    `description` TEXT NULL,
    `paymentstatus_id` INT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `customerreturnitem`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `customerreturn_id` INT NOT NULL,
    `item_id` INT NULL,
    `qty` DECIMAL(12,4) NULL,
    `returnedunitprice` DECIMAL(10,2) NULL
);

CREATE TABLE `customerreturn`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `sale_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `reason` TEXT NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `paymenttype_id` INT NOT NULL,
    `paymentstatus_id` INT NOT NULL,
    `chequeno` VARCHAR(255) NOT NULL,
    `chequedate` DATE NOT NULL,
    `chequebank` VARCHAR(255) NOT NULL,
    `chequebranch` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `disposalitem`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `disposal_id` INT NOT NULL,
    `item_id` INT NULL,
    `qty` DECIMAL(12,4) NULL
);

CREATE TABLE `disposal`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `date` DATE NOT NULL,
    `reason` TEXT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `employee`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `nametitle_id` INT NOT NULL,
    `callingname` VARCHAR(255) NOT NULL,
    `civilstatus_id` INT NULL,
    `fullname` VARCHAR(255) NOT NULL,
    `photo` CHAR(36) NULL,
    `dobirth` DATE NOT NULL,
    `gender_id` INT NOT NULL,
    `nic` VARCHAR(12) NOT NULL,
    `mobile` VARCHAR(10) NOT NULL,
    `land` VARCHAR(10) NULL,
    `email` VARCHAR(255) NULL,
    `address` TEXT NOT NULL,
    `designation_id` INT NOT NULL,
    `dorecruit` DATE NOT NULL,
    `employeestatus_id` INT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `item`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `name` VARCHAR(255) NULL,
    `itemcategory_id` INT NOT NULL,
    `unit_id` INT NOT NULL,
    `supplier_id` INT NOT NULL,
    `photo` CHAR(36) NULL,
    `price` DECIMAL(10,2) NOT NULL,
    `qty` DECIMAL(12,3) NULL,
    `rop` DECIMAL(12,3) NULL,
    `description` TEXT NULL,
    `itemstatus_id` INT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `purchaseitem`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `purchase_id` INT NOT NULL,
    `item_id` INT NULL,
    `qty` DECIMAL(12,4) NULL,
    `unitprice` DECIMAL(10,2) NULL,
    `subtotal` DECIMAL(10,2) NULL
);

CREATE TABLE `purchase`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `date` DATE NOT NULL,
    `supplier_id` INT NOT NULL,
    `total` DECIMAL(10,2) NOT NULL,
    `purchaseorder_id` INT NULL,
    `description` TEXT NULL,
    `purchasestatus_id` INT NOT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `purchaseorderitem`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `purchaseorder_id` INT NOT NULL,
    `item_id` INT NULL,
    `qty` DECIMAL(12,4) NULL
);

CREATE TABLE `purchaseorder`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `ordereddate` DATE NOT NULL,
    `requireddate` DATE NOT NULL,
    `supplier_id` INT NOT NULL,
    `description` TEXT NULL,
    `reciveddate` DATE NULL,
    `purchaseorderstatus_id` INT NOT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `saleitem`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `sale_id` INT NOT NULL,
    `item_id` INT NULL,
    `qty` DECIMAL(12,4) NULL,
    `unitprice` DECIMAL(10,2) NULL,
    `subtotal` DECIMAL(10,2) NULL
);

CREATE TABLE `transport`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `sale_id` INT NOT NULL,
    `item_id` INT NULL,
    `fee` DECIMAL(10,2) NULL,
    `location` TEXT NULL
);

CREATE TABLE `sale`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `date` DATE NOT NULL,
    `customer_id` INT NOT NULL,
    `total` DECIMAL(10,2) NOT NULL,
    `balance` DECIMAL(10,2) NULL,
    `saletype_id` INT NULL,
    `datetobepayed` DATE NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `supplier`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `contact1` CHAR(10) NOT NULL,
    `contact2` CHAR(10) NULL,
    `fax` CHAR(10) NULL,
    `email` VARCHAR(255) NULL,
    `address` TEXT NOT NULL,
    `creditallowed` DECIMAL(10,2) NULL,
    `description` TEXT NULL,
    `supplierstatus_id` INT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `supplierpayment`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `date` DATE NOT NULL,
    `chequeno` VARCHAR(255) NOT NULL,
    `chequedate` DATE NOT NULL,
    `chequebank` VARCHAR(255) NOT NULL,
    `chequebranch` VARCHAR(255) NOT NULL,
    `purchase_id` INT NOT NULL,
    `paymenttype_id` INT NOT NULL,
    `description` TEXT NULL,
    `paymentstatus_id` INT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `supplierreturnitem`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `supplierreturn_id` INT NOT NULL,
    `item_id` INT NULL,
    `qty` DECIMAL(12,4) NULL,
    `returnedunitprice` DECIMAL(10,2) NULL
);

CREATE TABLE `supplierreturn`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `supplier_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `reason` TEXT NOT NULL,
    `returnedamount` DECIMAL(10,2) NOT NULL,
    `paymenttype_id` INT NOT NULL,
    `paymentstatus_id` INT NOT NULL,
    `chequeno` VARCHAR(255) NOT NULL,
    `chequedate` DATE NOT NULL,
    `chequebank` VARCHAR(255) NOT NULL,
    `chequebranch` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `vehicle`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `no` VARCHAR(255) NOT NULL,
    `vehicletype_id` INT NULL,
    `description` TEXT NULL,
    `vehiclestatus_id` INT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `user`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `tocreation` DATETIME NULL,
    `tolocked` DATETIME NULL,
    `failedattempts` INT NULL DEFAULT 0,
    `creator_id` INT NULL,
    `photo` CHAR(36) NULL,
    `employee_id` INT NULL
);

CREATE TABLE `userrole`(
    `user_id` INT NOT NULL,
    `role_id` INT NOT NULL
);

CREATE TABLE `role`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `systemmodule`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);

CREATE TABLE `usecase`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `task` VARCHAR(255) NOT NULL,
    `systemmodule_id` INT NOT NULL
);

CREATE TABLE `roleusecase`(
    `role_id` INT NOT NULL,
    `usecase_id` INT NOT NULL
);

CREATE TABLE `notification`(
    `id` CHAR(36) NOT NULL,
    `dosend` DATETIME NOT NULL,
    `dodelivered` DATETIME NULL,
    `doread` DATETIME NULL,
    `message` TEXT NOT NULL,
    `user_id` INT NOT NULL
);

CREATE TABLE `token`(
    `id` CHAR(36) NOT NULL,
    `tocreation` DATETIME NULL,
    `toexpiration` DATETIME NULL,
    `ip` VARCHAR(100) NULL,
    `status` VARCHAR(20) NULL,
    `user_id` INT NOT NULL
);

CREATE TABLE `servicelog`(
    `id` CHAR(36) NOT NULL,
    `method` VARCHAR(10) NULL,
    `responsecode` INT NULL,
    `ip` VARCHAR(100) NULL,
    `torequest` DATETIME NULL,
    `url` TEXT NULL,
    `handler` VARCHAR(255) NULL,
    `token_id` CHAR(36) NULL
);

CREATE TABLE `file`(
    `id` CHAR(36) NOT NULL,
    `file` MEDIUMBLOB NULL,
    `thumbnail` MEDIUMBLOB NULL,
    `filemimetype` VARCHAR(255) NULL,
    `thumbnailmimetype` VARCHAR(255) NULL,
    `filesize` INT NULL,
    `originalname` VARCHAR(255) NULL,
    `tocreation` DATETIME NULL,
    `isused` TINYINT NULL DEFAULT 0
);



-- primary key definitions
ALTER TABLE `userrole` ADD CONSTRAINT pk_userrole PRIMARY KEY (`user_id`,`role_id`);
ALTER TABLE `roleusecase` ADD CONSTRAINT pk_roleusecase PRIMARY KEY (`role_id`,`usecase_id`);
ALTER TABLE `notification` ADD CONSTRAINT pk_notification PRIMARY KEY (`id`);
ALTER TABLE `token` ADD CONSTRAINT pk_token PRIMARY KEY (`id`);
ALTER TABLE `servicelog` ADD CONSTRAINT pk_servicelog PRIMARY KEY (`id`);
ALTER TABLE `file` ADD CONSTRAINT pk_file PRIMARY KEY (`id`);


-- unique key definitions
ALTER TABLE `customer` ADD CONSTRAINT unique_customer_code UNIQUE (`code`);
ALTER TABLE `customer` ADD CONSTRAINT unique_customer_nic UNIQUE (`nic`);
ALTER TABLE `customerpayment` ADD CONSTRAINT unique_customerpayment_code UNIQUE (`code`);
ALTER TABLE `customerpayment` ADD CONSTRAINT unique_customerpayment_chequeno UNIQUE (`chequeno`);
ALTER TABLE `customerpayment` ADD CONSTRAINT unique_customerpayment_chequebank UNIQUE (`chequebank`);
ALTER TABLE `customerpayment` ADD CONSTRAINT unique_customerpayment_chequebranch UNIQUE (`chequebranch`);
ALTER TABLE `customerreturn` ADD CONSTRAINT unique_customerreturn_code UNIQUE (`code`);
ALTER TABLE `customerreturn` ADD CONSTRAINT unique_customerreturn_chequeno UNIQUE (`chequeno`);
ALTER TABLE `customerreturn` ADD CONSTRAINT unique_customerreturn_chequebank UNIQUE (`chequebank`);
ALTER TABLE `customerreturn` ADD CONSTRAINT unique_customerreturn_chequebranch UNIQUE (`chequebranch`);
ALTER TABLE `disposal` ADD CONSTRAINT unique_disposal_code UNIQUE (`code`);
ALTER TABLE `employee` ADD CONSTRAINT unique_employee_code UNIQUE (`code`);
ALTER TABLE `employee` ADD CONSTRAINT unique_employee_nic UNIQUE (`nic`);
ALTER TABLE `employee` ADD CONSTRAINT unique_employee_mobile UNIQUE (`mobile`);
ALTER TABLE `employee` ADD CONSTRAINT unique_employee_email UNIQUE (`email`);
ALTER TABLE `item` ADD CONSTRAINT unique_item_code UNIQUE (`code`);
ALTER TABLE `item` ADD CONSTRAINT unique_item_name UNIQUE (`name`);
ALTER TABLE `purchase` ADD CONSTRAINT unique_purchase_code UNIQUE (`code`);
ALTER TABLE `purchaseorder` ADD CONSTRAINT unique_purchaseorder_code UNIQUE (`code`);
ALTER TABLE `sale` ADD CONSTRAINT unique_sale_code UNIQUE (`code`);
ALTER TABLE `supplier` ADD CONSTRAINT unique_supplier_code UNIQUE (`code`);
ALTER TABLE `supplierpayment` ADD CONSTRAINT unique_supplierpayment_code UNIQUE (`code`);
ALTER TABLE `supplierpayment` ADD CONSTRAINT unique_supplierpayment_chequeno UNIQUE (`chequeno`);
ALTER TABLE `supplierpayment` ADD CONSTRAINT unique_supplierpayment_chequebank UNIQUE (`chequebank`);
ALTER TABLE `supplierpayment` ADD CONSTRAINT unique_supplierpayment_chequebranch UNIQUE (`chequebranch`);
ALTER TABLE `supplierreturn` ADD CONSTRAINT unique_supplierreturn_code UNIQUE (`code`);
ALTER TABLE `supplierreturn` ADD CONSTRAINT unique_supplierreturn_chequeno UNIQUE (`chequeno`);
ALTER TABLE `supplierreturn` ADD CONSTRAINT unique_supplierreturn_chequebank UNIQUE (`chequebank`);
ALTER TABLE `supplierreturn` ADD CONSTRAINT unique_supplierreturn_chequebranch UNIQUE (`chequebranch`);
ALTER TABLE `vehicle` ADD CONSTRAINT unique_vehicle_no UNIQUE (`no`);
ALTER TABLE `user` ADD CONSTRAINT unique_user_employee_id UNIQUE (`employee_id`);
ALTER TABLE `user` ADD CONSTRAINT unique_user_username UNIQUE (`username`);
ALTER TABLE `role` ADD CONSTRAINT unique_role_name UNIQUE (`name`);


-- foreign key definitions
ALTER TABLE `customer` ADD CONSTRAINT f_customer_nametitle_id_fr_nametitle_id FOREIGN KEY (`nametitle_id`) REFERENCES `nametitle`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customer` ADD CONSTRAINT f_customer_customerstatus_id_fr_customerstatus_id FOREIGN KEY (`customerstatus_id`) REFERENCES `customerstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customer` ADD CONSTRAINT f_customer_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerpayment` ADD CONSTRAINT f_customerpayment_sale_id_fr_sale_id FOREIGN KEY (`sale_id`) REFERENCES `sale`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerpayment` ADD CONSTRAINT f_customerpayment_paymenttype_id_fr_paymenttype_id FOREIGN KEY (`paymenttype_id`) REFERENCES `paymenttype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerpayment` ADD CONSTRAINT f_customerpayment_paymentstatus_id_fr_paymentstatus_id FOREIGN KEY (`paymentstatus_id`) REFERENCES `paymentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerpayment` ADD CONSTRAINT f_customerpayment_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerreturn` ADD CONSTRAINT f_customerreturn_sale_id_fr_sale_id FOREIGN KEY (`sale_id`) REFERENCES `sale`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerreturn` ADD CONSTRAINT f_customerreturn_paymenttype_id_fr_paymenttype_id FOREIGN KEY (`paymenttype_id`) REFERENCES `paymenttype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerreturn` ADD CONSTRAINT f_customerreturn_paymentstatus_id_fr_paymentstatus_id FOREIGN KEY (`paymentstatus_id`) REFERENCES `paymentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerreturnitem` ADD CONSTRAINT f_customerreturnitem_item_id_fr_item_id FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerreturnitem` ADD CONSTRAINT f_customerreturnitem_customerreturn_id_fr_customerreturn_id FOREIGN KEY (`customerreturn_id`) REFERENCES `customerreturn`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerreturn` ADD CONSTRAINT f_customerreturn_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `disposalitem` ADD CONSTRAINT f_disposalitem_item_id_fr_item_id FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `disposalitem` ADD CONSTRAINT f_disposalitem_disposal_id_fr_disposal_id FOREIGN KEY (`disposal_id`) REFERENCES `disposal`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `disposal` ADD CONSTRAINT f_disposal_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_nametitle_id_fr_nametitle_id FOREIGN KEY (`nametitle_id`) REFERENCES `nametitle`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_civilstatus_id_fr_civilstatus_id FOREIGN KEY (`civilstatus_id`) REFERENCES `civilstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_gender_id_fr_gender_id FOREIGN KEY (`gender_id`) REFERENCES `gender`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_designation_id_fr_designation_id FOREIGN KEY (`designation_id`) REFERENCES `designation`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_employeestatus_id_fr_employeestatus_id FOREIGN KEY (`employeestatus_id`) REFERENCES `employeestatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `item` ADD CONSTRAINT f_item_itemcategory_id_fr_itemcategory_id FOREIGN KEY (`itemcategory_id`) REFERENCES `itemcategory`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `item` ADD CONSTRAINT f_item_unit_id_fr_unit_id FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `item` ADD CONSTRAINT f_item_supplier_id_fr_supplier_id FOREIGN KEY (`supplier_id`) REFERENCES `supplier`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `item` ADD CONSTRAINT f_item_itemstatus_id_fr_itemstatus_id FOREIGN KEY (`itemstatus_id`) REFERENCES `itemstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `item` ADD CONSTRAINT f_item_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `purchase` ADD CONSTRAINT f_purchase_supplier_id_fr_supplier_id FOREIGN KEY (`supplier_id`) REFERENCES `supplier`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `purchase` ADD CONSTRAINT f_purchase_purchaseorder_id_fr_purchaseorder_id FOREIGN KEY (`purchaseorder_id`) REFERENCES `purchaseorder`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `purchase` ADD CONSTRAINT f_purchase_purchasestatus_id_fr_purchasestatus_id FOREIGN KEY (`purchasestatus_id`) REFERENCES `purchasestatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `purchaseitem` ADD CONSTRAINT f_purchaseitem_item_id_fr_item_id FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `purchaseitem` ADD CONSTRAINT f_purchaseitem_purchase_id_fr_purchase_id FOREIGN KEY (`purchase_id`) REFERENCES `purchase`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `purchase` ADD CONSTRAINT f_purchase_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `purchaseorder` ADD CONSTRAINT f_purchaseorder_supplier_id_fr_supplier_id FOREIGN KEY (`supplier_id`) REFERENCES `supplier`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `purchaseorder` ADD CONSTRAINT f_purchaseorder_purchaseorderstatus_id_fr_purchaseorderstatus_id FOREIGN KEY (`purchaseorderstatus_id`) REFERENCES `purchaseorderstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `purchaseorderitem` ADD CONSTRAINT f_purchaseorderitem_item_id_fr_item_id FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `purchaseorderitem` ADD CONSTRAINT f_purchaseorderitem_purchaseorder_id_fr_purchaseorder_id FOREIGN KEY (`purchaseorder_id`) REFERENCES `purchaseorder`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `purchaseorder` ADD CONSTRAINT f_purchaseorder_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `sale` ADD CONSTRAINT f_sale_customer_id_fr_customer_id FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `sale` ADD CONSTRAINT f_sale_saletype_id_fr_saletype_id FOREIGN KEY (`saletype_id`) REFERENCES `saletype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `saleitem` ADD CONSTRAINT f_saleitem_item_id_fr_item_id FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `saleitem` ADD CONSTRAINT f_saleitem_sale_id_fr_sale_id FOREIGN KEY (`sale_id`) REFERENCES `sale`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `transport` ADD CONSTRAINT f_transport_item_id_fr_item_id FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `transport` ADD CONSTRAINT f_transport_sale_id_fr_sale_id FOREIGN KEY (`sale_id`) REFERENCES `sale`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `sale` ADD CONSTRAINT f_sale_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplier` ADD CONSTRAINT f_supplier_supplierstatus_id_fr_supplierstatus_id FOREIGN KEY (`supplierstatus_id`) REFERENCES `supplierstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplier` ADD CONSTRAINT f_supplier_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierpayment` ADD CONSTRAINT f_supplierpayment_purchase_id_fr_purchase_id FOREIGN KEY (`purchase_id`) REFERENCES `purchase`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierpayment` ADD CONSTRAINT f_supplierpayment_paymenttype_id_fr_paymenttype_id FOREIGN KEY (`paymenttype_id`) REFERENCES `paymenttype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierpayment` ADD CONSTRAINT f_supplierpayment_paymentstatus_id_fr_paymentstatus_id FOREIGN KEY (`paymentstatus_id`) REFERENCES `paymentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierpayment` ADD CONSTRAINT f_supplierpayment_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierreturn` ADD CONSTRAINT f_supplierreturn_supplier_id_fr_supplier_id FOREIGN KEY (`supplier_id`) REFERENCES `supplier`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierreturn` ADD CONSTRAINT f_supplierreturn_paymenttype_id_fr_paymenttype_id FOREIGN KEY (`paymenttype_id`) REFERENCES `paymenttype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierreturn` ADD CONSTRAINT f_supplierreturn_paymentstatus_id_fr_paymentstatus_id FOREIGN KEY (`paymentstatus_id`) REFERENCES `paymentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierreturnitem` ADD CONSTRAINT f_supplierreturnitem_item_id_fr_item_id FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierreturnitem` ADD CONSTRAINT f_supplierreturnitem_supplierreturn_id_fr_supplierreturn_id FOREIGN KEY (`supplierreturn_id`) REFERENCES `supplierreturn`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierreturn` ADD CONSTRAINT f_supplierreturn_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `vehicle` ADD CONSTRAINT f_vehicle_vehicletype_id_fr_vehicletype_id FOREIGN KEY (`vehicletype_id`) REFERENCES `vehicletype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `vehicle` ADD CONSTRAINT f_vehicle_vehiclestatus_id_fr_vehiclestatus_id FOREIGN KEY (`vehiclestatus_id`) REFERENCES `vehiclestatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `vehicle` ADD CONSTRAINT f_vehicle_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `user` ADD CONSTRAINT f_user_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `user` ADD CONSTRAINT f_user_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `userrole` ADD CONSTRAINT f_userrole_user_id_fr_user_id FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `userrole` ADD CONSTRAINT f_userrole_role_id_fr_role_id FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `role` ADD CONSTRAINT f_role_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `roleusecase` ADD CONSTRAINT f_roleusecase_role_id_fr_role_id FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `roleusecase` ADD CONSTRAINT f_roleusecase_usecase_id_fr_usecase_id FOREIGN KEY (`usecase_id`) REFERENCES `usecase`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `usecase` ADD CONSTRAINT f_usecase_systemmodule_id_fr_systemmodule_id FOREIGN KEY (`systemmodule_id`) REFERENCES `systemmodule`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `notification` ADD CONSTRAINT f_notification_user_id_fr_user_id FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `token` ADD CONSTRAINT f_token_user_id_fr_user_id FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `servicelog` ADD CONSTRAINT f_servicelog_token_id_fr_token_id FOREIGN KEY (`token_id`) REFERENCES `token`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
