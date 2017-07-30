import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'

import { AppComponent } from './app.component'
import { DashboardComponent } from './dashboard.component'
import { LogInComponent } from './log-in.component'
import { NavComponent } from './nav.component'
import { NewPollComponent } from './new-poll.component'
import { ProfileComponent } from './profile.component'
import { PollComponent } from './poll.component'
import { AuthService } from './auth.service'
import { LoggedInGuard, LoggedOutGuard } from './routes.guard'
import { Polls } from './polls.mock'
import { RoutesModule } from './routes.module'

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LogInComponent,
    NavComponent,
    NewPollComponent,
    ProfileComponent,
    PollComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RoutesModule
  ],
  providers: [
    AuthService,
    LoggedInGuard,
    LoggedOutGuard,
    Polls
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
