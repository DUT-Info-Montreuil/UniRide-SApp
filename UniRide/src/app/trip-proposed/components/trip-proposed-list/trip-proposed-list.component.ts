import { Component, OnInit } from '@angular/core';
import { TripService } from '../../../core/services/trip/trip.service';
import { Trip } from '../../../core/models/trip.models';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-trip-proposed-list',
  templateUrl: './trip-proposed-list.component.html',
  styleUrls: ['./trip-proposed-list.component.css'],
  providers: [ConfirmationService],

})
export class TripProposedListComponent implements OnInit {

  trips: Trip[] = [];
  page!: number;
  totalPage!: number;
  subscriptionComplete: boolean = false;
  loading: boolean = true;
  trip!: Trip;
  selectedProducts!: Trip[] | null;



  constructor(private tripService: TripService, private router: Router, private confirmationService: ConfirmationService,private messageService: MessageService) { }

  ngOnInit(): void {
    this.tripService.getTripsProposed().subscribe({
      next: (data: any) => {
        this.totalPage = data.totalPages;
        this.page = data.page;
        data.trips.forEach((trip: any) => {
          this.trips.push({
            id: trip.trip_id,
            status: trip.status,
            driverId: trip.driver_id,
            departure: {
              id: trip.address.departure.id,
              name: trip.address.departure.name,
            },
            arrival: {
              id: trip.address.arrival.id,
              name: trip.address.arrival.name,
            },
            price: trip.price,
            proposedDate: new Date(trip.proposed_date),
          });
        });
      },
      complete: () => {
        this.trips = [...this.trips]
        this.loading = false;
        console.log(this.trips);
      }
    });
  }

  goToTripDetails(trip_id: number) {
    console.log(trip_id)
    this.router.navigate([`/trips/${trip_id}`]);

  }


  deleteSelectedTrips(trip: Trip) {
    console.log(trip)
    this.confirmationService.confirm({
        message: 'Etes vous sûr de supprimer ce(s) trajet(s) ?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          console.log(trip)
            this.trips = this.trips.filter((val) => val.id !== trip.id);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        }
    });
}

  getStatus(status: number): string {
    switch (status) {
      case 1: return 'À Venir';
      case 2: return 'Annulé';
      case 3: return 'Trajet Passé';
      case 4: return 'En Cours';
      default: return 'Inconnu';
    }
  }

  getSeverity(status: number): string {
    switch (status) {
      case 1: return 'primary';
      case 3: return 'warning';
      case 4: return 'success';
      default: return 'danger';
    }
  }
}
