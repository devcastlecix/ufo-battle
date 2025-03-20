import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { PreferencesComponent } from './pages/preferences/preferences.component';
import { RecordsComponent } from './pages/records/records.component';
import { HomeComponent } from './pages/home/home.component';
import { GameComponent } from './pages/game/game.component';
import { MenuComponent } from './core/components/menu/menu.component';
import { HTTP_INTERCEPTORS, provideHttpClient,  withInterceptorsFromDi  } from '@angular/common/http';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { RecordsTableComponent } from './shared/components/records-table/records-table.component';
import { GeneralScoresComponent } from './pages/records/general-scores/general-scores.component';
import { UserScoresComponent } from './pages/records/user-scores/user-scores.component';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { MissileComponent } from './pages/game/missile/missile.component';
import { PanelComponent } from './pages/game/panel/panel.component';
import { UfoComponent } from './pages/game/ufo/ufo.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    PreferencesComponent,
    RecordsComponent,
    HomeComponent,
    GameComponent,
    MenuComponent,
    LoadingComponent,
    RecordsTableComponent,
    GeneralScoresComponent,
    UserScoresComponent,
    MissileComponent,
    PanelComponent,
    UfoComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,      
    ToastrModule.forRoot({
      closeButton: true,      
      preventDuplicates: true,
    }), 
    BrowserModule,
    AppRoutingModule,          
    FormsModule,
    ReactiveFormsModule     
  ],
  providers: [    
    provideHttpClient(withInterceptorsFromDi())  ,    
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: ResponseInterceptor, 
      multi: true
    },  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
