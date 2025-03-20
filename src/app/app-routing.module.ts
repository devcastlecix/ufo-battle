import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreferencesComponent } from './pages/preferences/preferences.component';
import { RecordsComponent } from './pages/records/records.component';
import { GameComponent } from './pages/game/game.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginGuard } from './core/guards/login.guard';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'preferences', component: PreferencesComponent},
  {path: 'records', component: RecordsComponent},
  {path: 'game', component: GameComponent},
  {path: 'registration', component: RegistrationComponent, canActivate: [LoginGuard]},
  {path: 'login', component: LoginComponent, canActivate: [LoginGuard]},  
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: ' ', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
