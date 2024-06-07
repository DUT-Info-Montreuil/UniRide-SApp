import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AboutRoutingModule } from './about.rooting.module';
import { ConditionsComponent } from './components/conditions/conditions.component';
import { PrivacyComponent } from './components/privacy/privacy.component';



@NgModule({
  declarations: [
    ConditionsComponent,
    PrivacyComponent
  ],
  imports: [
    SharedModule,
    AboutRoutingModule
  ]
})
export class AboutModule { }
