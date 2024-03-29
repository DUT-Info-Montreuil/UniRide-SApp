import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { TripService } from 'src/app/core/services/trip/trip.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserInfoComponent } from '../user-info/user-info.component';

@Component({
  selector: 'app-passengers-list',
  templateUrl: './passengers-list.component.html',
  styleUrls: ['./passengers-list.component.css'],
  providers: [DialogService]
})
export class PassengersListComponent implements OnInit {
  @Input() tripId!: number;
  @Input() tripStatus?: number;
  @Input() totalNumberOfPassenger!: number;
  @Input() numberOfPassenger!: number;
  passengers: User[] = [];
  ref: DynamicDialogRef | undefined; 

  constructor(
    private tripService: TripService,
    private route: ActivatedRoute,
    public dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.getPassengers();
  }

  getPassengers(): void {
    for (let i = 0; i < this.totalNumberOfPassenger; i++) {
      this.passengers.push(
        {
          firstname: "",
          lastname: "",
          id: -2,
          profile_picture: ""
        }
      )
    }
    for (let i = 0; i < this.numberOfPassenger; i++) {
      this.passengers[i].id++
    }
    let i = 0;
    this.tripService.getTripPassengers(this.tripId).subscribe(
      {
        next: (data: any) => {
          data.forEach((passenger: any) => {
            this.passengers[i] = {
              firstname: passenger.firstname,
              lastname: passenger.lastname,
              id: passenger.id,
              profile_picture: passenger.pfp,
              joined: passenger.joined
            };
            i++;
          })
        },
        error: (err: any) => console.error(err)
      })
  }

  getStatusLabel(status?: boolean): string {
    switch (status) {
      case true: return 'À Board';
      case false: return 'À Récupérer';
      default: return 'Inconnu';
    }
  }

  chipValue(status?: boolean): any {
    switch (status) {
      case true: return 'success';
      case false: return 'danger';
      default: return 'primary';
    }
  }

  showDialog(passengerid: number) {
    console.log(passengerid)
    if (passengerid >= -1) {
    this.ref = this.dialogService.open(UserInfoComponent, {
      style: { width: '50vw' },
      data: {
        userid: passengerid
      },
      header: "Details du profil"
    })
  }
}

  ngOnDestroy() { 
    if (this.ref) { 
        this.ref.close(); 
    } 
} 
}
