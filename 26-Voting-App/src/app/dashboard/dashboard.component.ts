import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs/Subscription'
import { Title } from '@angular/platform-browser'

import { AuthService } from '../auth/auth.service'
import { PollDataService } from '../poll-data/poll-data.service'
import { Poll } from '../models/polls.model'

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private pollDataService: PollDataService,
    private router: Router,
    private titleService: Title
  ) { }

  private loggedInSubsc: Subscription
  private numPollsSubsc: Subscription
  private myPollsSubsc: Subscription
  loggedIn: boolean
  numPolls: number
  myPolls: Poll[]
  numMyPolls: number

  ngOnInit(): void {
    this.titleService.setTitle('Voting App | Dashboard')

    this.loggedInSubsc = this.authService.isLoggedIn().subscribe(loggedIn => this.loggedIn = loggedIn)

    this.numPollsSubsc = this.pollDataService.getPolls().subscribe(num => this.numPolls = +num)

    this.myPollsSubsc = this.pollDataService.getMyPolls().subscribe(polls => {
      this.myPolls = polls
      this.numMyPolls = polls.length
    })
  }

  routeNewPoll(): void {
    this.router.navigate(['/newpoll'])
  }

  routeRandomPoll(): void {
    const rand = Math.floor(Math.random() * this.numPolls)
    this.router.navigate([`/polls/${rand}`])
  }

  ngOnDestroy(): void {
    this.loggedInSubsc.unsubscribe()
    this.numPollsSubsc.unsubscribe()
    this.myPollsSubsc.unsubscribe()
  }
}