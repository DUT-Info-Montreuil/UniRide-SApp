import { Component, OnInit, ViewChild } from '@angular/core';
import { DocumentVerificationService } from '../core/services/document-verification/document-verification.service';
import { Table } from 'primeng/table';
import { DocumentVerificationDisplay } from '../core/models/document-verification-display';
import { Router } from '@angular/router';
import { Student } from '../core/models/student.model';
import { StatisticService } from '../core/services/statistic/statistic.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-document-verification-display',
  templateUrl: './document-verification-display.component.html',
  styleUrls: ['./document-verification-display.component.css'],
})
export class DocumentVerificationDisplayComponent implements OnInit {

  /**
   * Arguments for the chart
   */
  dataTrip: any;
  dateUser: any;
  totalTrips: number = 0;
  totalUsers: number = 0;
  totalDrivers: number = 0;
  totalPassengers: number = 0;
  options: any;
  textColor: string = 'black';

  /**
   * Arguments for the table
   */
  documentVerification: DocumentVerificationDisplay[] = [];
  students: Student[] = []; // a changer avec un modele
  loading: boolean = true;
  @ViewChild('dt1') table!: Table;

  constructor(
    private documentVerificationService: DocumentVerificationService,
    private router: Router,
    private statistiqueService: StatisticService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.statistiqueService.getTripsNumber().subscribe({
      next: (data: any) => {
        this.totalTrips = data.trip_count;
      },
      error: (error: any) => {
        this.toastr.error('La récupération des statistiques des trajets a echoué . Veuillez réessayer ultérieurement.', 'Erreur 📄❌🔄');
      },
      complete: () => {
        /**
         * Initialize the chart
         */
        const documentStyle = getComputedStyle(document.documentElement);
        this.dataTrip = this.getDataTrip(this.totalTrips, documentStyle)
        this.options = this.getOptions(this.textColor);
      }
    })

    this.statistiqueService.getNumberOfUsers().subscribe({
      next: (data: any) => {
        this.totalUsers = data.user_count;
        this.totalDrivers = data.drivers_count;
        this.totalPassengers = data.passengers_count;
      },
      error: (error: any) => {
        this.toastr.error('La récupération des statistiques des utilisateurs a echoué . Veuillez réessayer ultérieurement.', 'Erreur 📄❌🔄');
      },
      complete: () => {
        /**
         * Initialize the chart
         */
        const documentStyle = getComputedStyle(document.documentElement);
        this.dateUser = this.getDateUser(this.totalDrivers, this.totalPassengers, this.totalUsers, documentStyle)
      }
    })

    /**
     * Call the API to get the document verification for the user
     */
    this.documentVerificationService.getDocumentVerification().subscribe({
      next: (data: any) => {
        this.loading = false;
        data.request.forEach((verification: any) => {
          const student = new Student(verification.person.last_name, verification.person.first_name, verification.person.profile_picture, verification.person.id_user);
          const documentVerification = new DocumentVerificationDisplay(verification.request_number, verification.documents_to_verify, student);
          this.documentVerification.push(documentVerification);
          this.students.push(student);
        })
      },
      error: (error: any) => {
        this.loading = true;
        this.toastr.error('La récupération des demandes a échoué ', 'Erreur 📄❌🔄');
      },
      complete: () => {
        this.table.clear();//We need to call this method to refresh the table, cause the table is not refreshed automatically, when we call the API
      }
    })
  }

  /**
   * This method is used to clear the filters of the table
   * @param table 
   */
  clear(table: Table) {
    this.toastr.success('Tous les filtres ont été réinitialisés avec succès.', 'Info ✅📄🔄👍');
    table.clear();
  }

  /**
   * This method is used to manage the request verification document
   * @param id_user 
   * @param full_name 
   */
  manageRequestVerificationDocument(id_user: number, student: Student) {
    const full_name = student.first_name + ' ' + student.last_name
    this.router.navigate(['/manage-request-verification-document'], { queryParams: { id_user: id_user, full_name: full_name } });
  }

  getDataTrip(totalTrips: number, documentStyle: CSSStyleDeclaration) {
    return {
      labels: ['Total des trajets'],
      datasets: [
        {
          data: [totalTrips],
          backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
        }
      ]
    };
  }

  getDateUser(totalDrivers: number, totalPassengers: number, totalUsers: number, documentStyle: CSSStyleDeclaration) {
    return {
      labels: ['Total des conducteurs', 'Total des passagers', 'Total des utilisateurs'],
      datasets: [
        {
          data: [totalDrivers, totalPassengers, totalUsers],
          backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
        }
      ]
    };
  }

  getOptions(textColor: string) {
    return {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      }
    };
  }
}