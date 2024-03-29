import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentVerificationDisplayComponent } from './components/document-verification-display/document-verification-display.component';
import { ManageRequestVerificationDocumentComponent } from './components/manage-request-verification-document/manage-request-verification-document.component';
import { UserInfoAdminComponent } from './components/user-info-admin/user-info-admin.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin.rooting.module';
import { ManageLabelAdminComponent } from './components/manage-label-admin/manage-label-admin.component';



@NgModule({
  declarations: [
    DocumentVerificationDisplayComponent,
    ManageRequestVerificationDocumentComponent,
    UserInfoAdminComponent,
    UserListComponent,
    ManageLabelAdminComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule
  ],
  exports: [
    DocumentVerificationDisplayComponent,
    ManageRequestVerificationDocumentComponent,
    UserInfoAdminComponent,
    UserListComponent,
    ManageLabelAdminComponent
  ]
})
export class AdminModule { }
