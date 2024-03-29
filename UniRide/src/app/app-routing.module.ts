import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { roleGuardFactory } from './core/guards/role-guard';
import { ROLES } from './core/const/roles';

const routes: Routes = [
  { path: 'registration', loadChildren: () => import('./registration/registration.module').then(m => m.RegistrationModule) },
  { path: 'login', loadChildren: () => import('./log-in/log-in.module').then(m => m.LogInModule) },
  { path: 'change-password', loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule) },
  {
    path: 'trips',
    canActivateChild: [roleGuardFactory],
    children: [
      {
        path: 'create', loadChildren: () => import('./create-trip/create-trip.module').then(m => m.CreateTripModule),
        data: { roles: [ROLES.DRIVER, ROLES.ADMIN] }
      },
      {
        path: 'create-daily', loadChildren: () => import('./create-daily-trip/create-daily-trip.module').then(m => m.CreateDailyTripModule),
        data: { roles: [ROLES.DRIVER, ROLES.ADMIN] }
      },
      {
        path: 'search', loadChildren: () => import('./trip-search/trip-search.module').then(m => m.TripSearchModule),
        data: { roles: [ROLES.DRIVER, ROLES.PASSENGER, ROLES.ADMIN] }
      },
      {
        path: 'driver', loadChildren: () => import('./trip-proposed/trip-proposed.module').then(m => m.TripProposedModule),
        data: { roles: [ROLES.DRIVER, ROLES.ADMIN] }
      },
      {
        path: 'passenger', loadChildren: () => import('./trip-passenger/trip-passenger.module').then(m => m.TripPassengerModule),
        data: { roles: [ROLES.DRIVER, ROLES.PASSENGER, ROLES.ADMIN] }
      },
      {
        path: ':id', loadChildren: () => import('./trip-info/trip-info.module').then(m => m.TripInfoModule),
        data: { roles: [ROLES.DRIVER, ROLES.PASSENGER, ROLES.ADMIN] }
      },

    ],
    canActivate: [AuthGuard]
  },
  {
    path: 'validate-passenger', loadChildren: () => import('./validate-passenger/validate-passenger.module').then(m => m.ValidatePassengerModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'email', loadChildren: () => import('./email/email.module').then(m => m.EmailModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, roleGuardFactory],
    data: { roles: [ROLES.ADMIN] }
  },
  {
    path: 'profil-information', loadChildren: () => import('./profil/profil.module').then(m => m.ProfilModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'ranking', loadChildren: () => import('./ranking/ranking.module').then(m => m.RankingModule),
    data: { roles: [ROLES.DRIVER, ROLES.PASSENGER, ROLES.ADMIN] }
  },

  { path: 'about', loadChildren: () => import('./about/about.module').then(m => m.AboutModule) },

  {
    path: '', loadChildren: () => import('./homepage/homepage.module').then(m => m.HomepageModule),
    data: { roles: [ROLES.DRIVER, ROLES.PASSENGER, ROLES.DRIVER, ROLES.PENDING] }
  },

  { path: 'unauthorized', loadChildren: () => import('./unauthorized/unauthorized.module').then(m => m.UnauthorizedModule) },

  { path: '**', loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundModule) },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule { }
