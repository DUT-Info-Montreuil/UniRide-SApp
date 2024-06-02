import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TripInfoComponent } from "./components/trip-info/trip-info.component";
import { ModifyTripComponent } from "./components/modify-trip/modify-trip.component";

const routes: Routes = [
    { path: '', component: TripInfoComponent },
    { path: 'modify', component: ModifyTripComponent }
];
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class TripInfoRoutingModule {

}