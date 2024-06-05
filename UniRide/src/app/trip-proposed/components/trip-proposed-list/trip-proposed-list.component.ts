import { Component, OnInit } from '@angular/core';
import { TripService } from '../../../core/services/trip/trip.service';
import { Trip } from '../../../core/models/trip.models';
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
  selectedTrips!: Trip[] | null;

  constructor(
    private tripService: TripService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

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
        this.trips = [...this.trips];
        this.loading = false;
        console.log(this.trips);
      }
    });
  }

  goToTripDetails(trip_id: number) {
    console.log(trip_id);
    this.router.navigate([`/trips/${trip_id}`]);
  }

  deleteSelectedTrips() {
    if (this.selectedTrips && this.selectedTrips.length > 0) {
        console.log(this.selectedTrips);
        this.confirmationService.confirm({
            message: 'Etes-vous sûr de vouloir supprimer ces trajets ?',
            header: 'Confirmer',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // Appeler deleteTripsById pour chaque trip dans selectedTrips
                this.selectedTrips!.forEach(trip => {
                    this.tripService.deleteTripsById(trip.id).subscribe(
                        () => {
                            // Supprimer le trip de la liste après suppression réussie
                            this.trips = this.trips.filter(val => val.id !== trip.id);
                            location.reload()
                        },
                        error => {
                            console.error(`Erreur lors de la suppression du trajet avec l'ID ${trip.id}:`, error);
                        }
                    );
                });

                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Trajet(s) supprimé(s)', life: 3000 });
                this.selectedTrips = null; // Réinitialiser la sélection après la suppression
            }
        });
    }
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
