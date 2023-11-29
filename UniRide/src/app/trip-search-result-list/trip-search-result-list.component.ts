// trip-search-result-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripService } from '../Services/Trip/trip.service';
import { map, tap } from 'rxjs';
import { Trip } from '../models/trip.models';

@Component({
  selector: 'app-trip-search-result-list',
  templateUrl: './trip-search-result-list.component.html',
  styleUrls: ['./trip-search-result-list.component.css']
})
export class TripSearchResultListComponent implements OnInit {

  searchResults: Trip[] = [];

  constructor(private tripService: TripService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      tap((params: any) => {
        this.tripService.searchTrips(params["params"]).pipe(
          tap((data: any) => {
            console.log('data:', data)
            data.trips.forEach((trip: any) => {
              this.searchResults.push({
                id: trip.trip_id,
                driverId: trip.driver,
                departure: {
                  id: trip.address.departure.id,
                  name: trip.address.departure.address_name,
                  longitude: trip.address.departure.longitude,
                  latitude: trip.address.departure.latitude,
                },
                arrival: {
                  id: trip.address.arrival.id,
                  name: trip.address.arrival.address_name,
                  longitude: trip.address.arrival.longitude,
                  latitude: trip.address.arrival.latitude,
                },
                price: trip.price,
                proposedDate: new Date(trip.proposed_date),
                numberOfPassenger: trip.total_passenger_count,
                distance: trip.address.distance,
              });
            });
          }),
        ).subscribe();
        console.log('searchResults:', this.searchResults);
      }),
    ).subscribe();
  }

}