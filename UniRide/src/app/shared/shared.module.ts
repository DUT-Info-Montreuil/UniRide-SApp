import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistancePipe } from './pipes/distance/distance.pipe';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BadgeModule } from 'primeng/badge';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { AccordionModule } from 'primeng/accordion';
import { BlockUIModule } from 'primeng/blockui';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';
import { SkeletonModule } from 'primeng/skeleton';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { DisplayPdfComponent } from './components/display-pdf/display-pdf.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TooltipModule } from 'primeng/tooltip';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InplaceModule } from 'primeng/inplace';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { SplitterModule } from 'primeng/splitter';



@NgModule({
  declarations: [
    DistancePipe,
    DisplayPdfComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    PdfViewerModule,
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    ButtonModule,
    AvatarModule,
    AvatarGroupModule,
    DividerModule,
    PanelModule,
    ConfirmDialogModule,
    BadgeModule,
    SidebarModule,
    PanelMenuModule,
    MenuModule,
    MenubarModule,
    OverlayPanelModule,
    MessagesModule,
    TableModule,
    AccordionModule,
    BlockUIModule,
    FieldsetModule,
    MultiSelectModule,
    DataViewModule,
    TagModule,
    ImageModule,
    ConfirmPopupModule,
    ToastModule,
    ChartModule,
    InputTextareaModule,
    DropdownModule,
    RatingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DistancePipe,
    SkeletonModule,
    TabViewModule,
    InputTextModule,
    FileUploadModule,
    DialogModule,
    ToolbarModule,
    MessageModule,
    PasswordModule,
    InputNumberModule,
    CheckboxModule,
    DisplayPdfComponent,
    TooltipModule,
    RadioButtonModule,
    CalendarModule,
    SelectButtonModule,
    InplaceModule,
    DynamicDialogModule,
    SplitterModule
  ]
})
export class SharedModule { }
