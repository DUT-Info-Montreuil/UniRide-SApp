import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap, map } from 'rxjs/operators';
import { environment } from '../../../../environements/environement';


@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private backUrl = environment.backUrl;
  private universityAddress!: any;

  private apiKey = environment.googleKey;
  private geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(private http: HttpClient) { }

  private handleError(error: any): Observable<never> {
    console.error(' error:', error);
    return throwError('Une erreur s\'est produite. Veuillez réessayer plus tard.');
  }

  createAddress(addressData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(
      `${this.backUrl}/address/add`,
      JSON.stringify(addressData),
      { headers: headers }
    );
  }

  formatAddress(addressComponents: any): string {
    const street_number = addressComponents.find((component: any) => component.types.includes('street_number'))?.long_name || '';
    const street = addressComponents.find((component: any) => component.types.includes('route'))?.long_name || '';
    const city = addressComponents.find((component: any) => component.types.includes('locality'))?.long_name || '';
    const postal_code = addressComponents.find((component: any) => component.types.includes('postal_code'))?.long_name || '';
    const formattedAddress = `${street_number},${street},${city} ${postal_code}`;
    return formattedAddress;
  }

  extractAddressData(place: any): any {
    const street_number = place.address_components.find((component: any) => component.types.includes('street_number'))?.long_name || '';
    const street_name = place.address_components.find((component: any) => component.types.includes('route'))?.long_name || '';
    const city = place.address_components.find((component: any) => component.types.includes('locality'))?.long_name || '';
    const postal_code = place.address_components.find((component: any) => component.types.includes('postal_code'))?.long_name || '';
    const description = place.formatted_address || '';

    return {
      street_number: street_number,
      street_name: street_name,
      city: city,
      postal_code: postal_code,
      description: description
    };
  }

  callUniversityAddress(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get(
      `${this.backUrl}/address/university`,
      { headers: headers }
    ).pipe(
      switchMap((response: any) => this.getPlaceDetails(response["address"]).pipe(
        tap((response) => {
          this.universityAddress = response;
        },))
      ),
      catchError(this.handleError)
    );
  }

  getUniversityAddress(): any {
    return this.universityAddress;
  }

  getPlaceDetails(address: string): Observable<any> {
    const url = `${this.geocodeUrl}?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response["results"][0];
      },));
  }

}
