import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { RoutesModule } from './routes.module'
import { AppComponent } from './app.component'
import { NavComponent } from './nav.component'
import { DashboardComponent } from './dashboard.component'

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    RoutesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
