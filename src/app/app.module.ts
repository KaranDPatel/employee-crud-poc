import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// AG Grid
import { AgGridModule } from 'ag-grid-angular';

// Components
import { AppComponent } from './app.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
// Store
import { employeeReducer } from './store/employee.reducer';
import { EmployeeEffects } from './store/employee.effects';

// Services
import { EmployeeService } from './services/employee.service';

//Routing Module
import { AppRoutingModule } from './app.routing.module';

//MSAL Module
import { MsalModule, MsalRedirectComponent, MsalGuard, MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeListComponent,
    EmployeeFormComponent
  ],
  imports: [
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: '{}', //Insert the clinet ID
          authority: 'https://login.microsoftonline.com/{}', //Insert the tenant ID
          redirectUri: 'http://localhost:4200/'
        }
      }),
      {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ['user.read']
        }
      },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map()
      }
    ),
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AgGridModule,
    AppRoutingModule,
    StoreModule.forRoot({ employees: employeeReducer }),
    EffectsModule.forRoot([EmployeeEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      features: {
        pause: false,
        lock: true,
        persist: true
      }
    })
  ],
  providers: [EmployeeService, MsalGuard, MsalService, MsalBroadcastService],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }