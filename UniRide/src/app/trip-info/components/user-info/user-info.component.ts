import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user/user.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  user!: User;
  constructor(
    private userService: UserService,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.getUserInfoDetails()
  }

  getUserInfoDetails() {
    this.userService.getUserInfoDetails(this.config.data.userid).subscribe({
      next: (data: any) => {
        this.user = {
          id: data.user_information.id,
          firstname: data.user_information.firstname,
          lastname: data.user_information.lastname,
          gender: data.user_information.gender,
          description: data.user_information.description,
          phone_number: data.user_information.phone_number,
          profile_picture: data.user_information.profile_picture??""
        }
      },
      error: (error: any) => {

      }
    })
  }

  showDialog() {
    this.getUserInfoDetails()
  }

  getGender() {
    switch (this.user.gender) {
      case "H": return "Homme";
      case "F": return "Femme";
      default: return "Autre";
    }
  }

  getPhoneNumber() {
    return this.user.phone_number;
  }
}
