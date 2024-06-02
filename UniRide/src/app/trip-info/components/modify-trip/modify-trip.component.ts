import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tap, firstValueFrom } from 'rxjs';
import { TripService } from '../../../core/services/trip/trip.service';
import { AddressService } from '../../../core/services/address/address.service';
import { MapService } from '../../../core/services/map/map.service';
import { MessageService } from 'primeng/api';
import { Trip } from '../../../core/models/trip.models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modify-trip',
  templateUrl: './modify-trip.component.html',
  styleUrls: ['./modify-trip.component.css']
})
export class ModifyTripComponent implements OnInit {
  minDate: Date = new Date();
  tripForm!: FormGroup;
  description: string = " ";  
  trip!: Trip;
  userId!: Number;

  @ViewChild('searchInputDeparture', { static: true }) searchInputDeparture!: ElementRef<HTMLInputElement>;
  @ViewChild('searchInputArrival', { static: true }) searchInputArrival!: ElementRef<HTMLInputElement>;

  constructor(
    private mapService: MapService,
    private formBuilder: FormBuilder,
    private tripService: TripService,
    private addressService: AddressService,
    private renderer: Renderer2,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem("user_id"))
    this.initializeForm();
    this.getTripDetails();
  }

  initializeForm(): void {
    this.tripForm = this.formBuilder.group({
      addressDeparture: ['', Validators.required],
      addressArrival: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      passengerNumber: ['', Validators.required]
    });
  }

  getTripDetails(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.tripService.getTripById(id).pipe(
      tap((data: any) => {
        this.trip = {
          id: data.trip_id,
          driverId: data.driver_id,
          price: data.price,
          departure: {
            id: data.address.departure.id,
            name: data.address.departure.address_name
          },
          arrival: {
            id: data.address.arrival.id,
            name: data.address.arrival.address_name
          },
          proposedDate: data.departure_date,
          numberOfPassenger: data.passenger_count ?? 0,
          status: data.status,
          totalNumberOfPassenger: data.total_passenger_count,
          arrivalDate: data.arrival_date
        };
        this.checkCanModify();
        this.loadForm();
      })).subscribe()
  }

  loadForm(): void {
    this.tripForm.setValue({
      addressDeparture: this.trip.departure.name,
      addressArrival: this.trip.arrival.name,
      date: new Date(this.trip.proposedDate),
      time: new Date(this.trip.proposedDate),
      passengerNumber: this.trip.totalNumberOfPassenger
    });
    if (!this.addressService.getUniversityAddress()) {
      this.addressService.callUniversityAddress().pipe(
        tap(() => {
          this.mapService.addGoogleMapsScript(this.renderer, this.tripForm, this.searchInputDeparture, this.searchInputArrival, true)
        })
      ).subscribe();
    } else {
      this.mapService.addGoogleMapsScript(this.renderer, this.tripForm, this.searchInputDeparture, this.searchInputArrival, true)
    }
  }

  checkCanModify(): void {
    if (this.trip.driverId != this.userId || this.trip.status != 1) {
      this.router.navigate([`unauthorized`]);
    }
  }

  async onSubmit() {
    this.messageService.clear();
    if (this.tripForm.valid) {
      // Utilise l'autocomplétion pour obtenir les données de l'address de départ
      let placeDeparture = this.mapService.getAutocompleteDeparture().getPlace();
      if (placeDeparture == undefined) {
        placeDeparture = await firstValueFrom(this.addressService.getPlaceDetails(this.tripForm.value.addressDeparture));
      }
      const addressDataDeparture = this.addressService.extractAddressData(placeDeparture);

      // Utilise l'autocomplétion pour obtenir les données de l'address d'arrivée
      let placeArrival = this.mapService.getAutocompleteArrival().getPlace();
      if (placeArrival == undefined) {
        placeArrival = await firstValueFrom(this.addressService.getPlaceDetails(this.tripForm.value.addressArrival));
      }
      const addressDataArrival = this.addressService.extractAddressData(placeArrival);

      this.addressService.createAddress(addressDataDeparture).subscribe(
        (addressResponseDeparture: any) => {
          const addressIdDeparture = this.extractIdFromResponse(addressResponseDeparture);

          this.addressService.createAddress(addressDataArrival).subscribe(
            (addressResponseArrival: any) => {
              const addressIdArrival = this.extractIdFromResponse(addressResponseArrival);

              const tripData = {
                trip_id: this.trip.id,
                address_departure_id: addressIdDeparture,
                address_arrival_id: addressIdArrival,
                timestamp_proposed: this.formattedDate(),
                total_passenger_count: this.tripForm.value.passengerNumber,
              };
              this.tripService.modifyTrip(tripData).subscribe(
                (tripId) => {
                  this.messageService.add({ severity: 'success', summary: 'Trajet modifié avec succès' });
                  console.log('Trajet modifié avec succès, ID :', this.trip.id);
                  setTimeout(() => this.router.navigate([`trips/${this.trip.id}`]), 2000);
                },
                (tripError) => {
                  if (tripError.error.message == "INVALID_TIMESTAMP_PROPOSED") {
                    this.scrollToSection('map');
                    this.messageService.add({ severity: 'error', summary: 'La date et/ou l\'heure du trajet sont invalides' });
                  } else if (tripError.error.message == "TRIP_ALREADY_EXISTS") {
                    this.scrollToSection('map');
                    this.messageService.add({ severity: 'error', summary: 'Un trajet identique existe déjà' });
                  } else {
                    console.error('Erreur lors de la modification du trajet', tripError);
                    this.scrollToSection('map');
                    this.messageService.add({ severity: 'error', summary: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
                  }
                }
              );
            },
            (addressErrorArrival: any) => {
              if (addressErrorArrival.error.message == "STREET_NUMBER_CANNOT_BE_NULL") {
                this.scrollToSection('map');
                this.messageService.add({ severity: 'error', summary: 'L\'adresse d\'arrivée n\'est pas valide' });
              } else {
                console.error('Erreur lors de la modification du trajet', addressErrorArrival);
                this.scrollToSection('map');
                this.messageService.add({ severity: 'error', summary: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
              }
            }
          );
        },
        (addressErrorDeparture: any) => {
          if (addressErrorDeparture.error.message == "STREET_NUMBER_CANNOT_BE_NULL") {
            this.scrollToSection('map');
            this.messageService.add({ severity: 'error', summary: 'L\'adresse de départ n\'est pas valide' });
          } else {
            console.error('Erreur lors de la modification du trajet', addressErrorDeparture);
            this.scrollToSection('map');
            this.messageService.add({ severity: 'error', summary: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
          }
        }
      );
    }
  }
  // Fonction générique pour extraire l'identifiant de la réponse
  private extractIdFromResponse(response: any): any {
    // Adapter cette partie en fonction de la structure réelle de la réponse
    return response.id_address || response.data?.id_address || null;
  }

  private formattedDate(): string {
    const date = new Date(this.tripForm.value.date);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ajoute un zéro si le mois est < 10
    const day = date.getDate().toString().padStart(2, '0'); // Ajoute un zéro si le jour est < 10

    const time = new Date(this.tripForm.value.time);
    const hours = time.getHours().toString().padStart(2, '0'); // Ajoute un zéro si l'heure est < 10
    const minutes = time.getMinutes().toString().padStart(2, '0'); // Ajoute un zéro si les minutes sont < 10

    return `${year}-${month}-${day} ${hours}:${minutes}:00`;
  }


  scrollToSection(section: string): void {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  cancel(): void {
    this.router.navigate([`trips/${this.trip.id}`]);
  }
}
