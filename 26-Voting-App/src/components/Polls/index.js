import React from 'react'
import { Helmet } from 'react-helmet'
import injectSheet from 'react-jss'
import { withRouter } from 'react-router'

import { siteTitle } from '../../App'

import Poll from './Poll'
import Results from './Results'
import styles from './styles'

class Polls extends React.Component {
  constructor (props) {
    super(props)

    this.setLocalPoll = this.setLocalPoll.bind(this)
    this.renderSiteTitle = this.renderSiteTitle.bind(this)
    this.renderPageTitle = this.renderPageTitle.bind(this)
    this.renderOwner = this.renderOwner.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.renderWhichPage = this.renderWhichPage.bind(this)
    this.addOptions = this.addOptions.bind(this)
    this.handleOptionEdit = this.handleOptionEdit.bind(this)
    this.addAnswer = this.addAnswer.bind(this)
    this.deleteAnswer = this.deleteAnswer.bind(this)
    this.saveEdit = this.saveEdit.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
    this.voting = this.voting.bind(this)
    this.deleting = this.deleting.bind(this)
    this.confirmingDelete = this.confirmingDelete.bind(this)
    this.cancelingDelete = this.cancelingDelete.bind(this)

    this.state = {
      confirmDelete: false,
      poll: undefined,
      answers: undefined,
      editing: false,
      addingAnswers: []
    }

    this.props.onLoadPoll(this.props.match.params.id, this.setLocalPoll)
  }

  setLocalPoll () {
    if (this.props.state.currentPoll) {
      this.setState(prevState => ({
        poll: JSON.parse(JSON.stringify(this.props.state.currentPoll))
      }), () => {
        let answersArr = JSON.parse(JSON.stringify(this.state.poll.answers))
        let answers = {}
        let choice

        for (let i = 0; i < answersArr.length; i++) {
          let a = answersArr[i]

          if (this.state.poll.type === 'radio' && a.userVotes.includes(this.props.state.userName)) {
            choice = a.answer
            break
          }

          answers[a.id] = a.userVotes.includes(this.props.state.userName)
        }

        if (this.state.poll.type === 'radio') {
          if (choice === undefined) {
            choice = false
          }

          this.setState(prevState => ({
            answers: choice
          }))
        } else if (this.state.poll.type === 'checkbox') {
          this.setState(prevState => ({
            answers: answers
          }))
        }
      })
    }
  }

  renderSiteTitle () {
    return this.props.state.currentPoll
      ? `Poll: ${this.props.state.currentPoll.question}`
      : 'Poll'
  }

  renderPageTitle () {
    if (this.state.poll) {
      return <h2>{this.state.poll.question}</h2>
    } else {
      return <h2>Loading&hellip;</h2>
    }
  }

  renderOwner () {
    if (this.props.state.currentPoll) {
      return (
        <p className={this.props.classes.owner}>
          Poll posted by <a
            className={this.props.classes.ownerLink}
            href={`https://github.com/${this.props.state.currentPoll.owner}`}
          >
            @{this.props.state.currentPoll.owner}
          </a>.
        </p>)
    } else {
      return null
    }
  }

  handleChange (e) {
    let answers = JSON.parse(JSON.stringify(this.state.answers))
    if (this.state.poll.type === 'checkbox') {
      answers[+e.target.id] = e.target.checked
    } else if (this.state.poll.type === 'radio') {
      answers = e.target.value
    }
    this.setState(prevState => ({
      answers: answers
    }))
  }

  renderWhichPage () {
    if (this.state.poll && this.props.state.currentPoll) {
      if (this.props.page === 'poll') {
        return (
          <Poll
            pollState={this.state}
            owned={this.state.poll.owner === this.props.state.userName}
            editable={this.props.state.currentPoll.editable || false}
            onAddOptions={this.addOptions}
            onHandleOptionEdit={this.handleOptionEdit}
            addAnswer={this.addAnswer}
            deleteAnswer={this.deleteAnswer}
            onSaveEdit={this.saveEdit}
            onCancelEdit={this.cancelEdit}
            onChange={this.handleChange}
            voting={this.voting}
            deleting={this.deleting}
            confirmingDelete={this.confirmingDelete}
            cancelingDelete={this.cancelingDelete}
            {...this.props}
          />
        )
      } else if (this.props.page === 'results') {
        return (
          <Results
            pollState={this.state}
            owned={this.state.poll.owner === this.props.state.userName}
            deleting={this.deleting}
            confirmingDelete={this.confirmingDelete}
            cancelingDelete={this.cancelingDelete}
            {...this.props}
          />
        )
      } else {
        return null
      }
    } else {
      return null
    }
  }

  addOptions (e) {
    e.preventDefault()
    this.setState(prevState => ({
      editing: true
    }))
  }

  handleOptionEdit (e) {
    e.preventDefault()
    let answers = this.state.addingAnswers.slice()
    const i = e.target.id.slice(7)
    answers[i] = e.target.value
    this.setState(prevState => ({
      addingAnswers: answers
    }))
  }

  addAnswer (e) {
    e.preventDefault()
    let answers = this.state.addingAnswers.slice()
    answers.push('')
    this.setState(prevState => ({
      addingAnswers: answers
    }))
  }

  deleteAnswer (e) {
    e.preventDefault()
    let answers = this.state.addingAnswers.slice()
    const i = e.target.id.slice(7)
    answers.splice(i, 1)
    this.setState(prevState => ({
      addingAnswers: answers
    }))
  }

  saveEdit (e) {
    e.preventDefault()
    let addingAnswers = []

    for (let i = 0; i < this.state.addingAnswers.length; i++) {
      addingAnswers.push({
        id: i + this.state.poll.answers.length,
        answer: this.state.addingAnswers[i],
        userVotes: [],
        guestVotes: 0
      })
    }

    const answers = {
      answers: this.state.poll.answers.concat(addingAnswers)
    }

    this.setState(prevState => ({
      editing: false,
      addingAnswers: []
    }), this.props.updatePoll(this.props.match.params.id, answers, this.setLocalPoll))
  }

  cancelEdit (e) {
    e.preventDefault()
    this.setState(prevState => ({
      editing: false
    }))
  }

  voting () {
    const poll = JSON.parse(JSON.stringify(this.state.poll))
    const user = this.props.state.loggedIn ? this.props.state.userName : null
    let answers = poll.answers.slice()

    if (user) {
      // If logged in
      if (typeof this.state.answers === 'string') {
        // If answer selection is radio/single-select
        for (let i = 0; i < answers.length; i++) {
          if (answers[i].answer === this.state.answers && !answers[i].userVotes.includes(user)) {
            // If they voted for this option but the db doesn't show that, add their vote to the db
            answers[i].userVotes.push(user)
          } else if (answers[i].answer !== this.state.answers && answers[i].userVotes.includes(user)) {
            // If they voted against this option but the db says they voted for it, remove their vote from the db
            let j = answers[i].userVotes.indexOf(user)
            answers[i].userVotes.splice(j, 1)
          }
        }
      } else if (typeof this.state.answers === 'object') {
        // If answer selection is checkbox/multi-select
        for (let ans in this.state.answers) {
          for (let i = 0; i < answers.length; i++) {
            if (answers[i].id === +ans) {
              if (this.state.answers[+ans] && !answers[i].userVotes.includes(user)) {
                // If they voted for this option but the db doesn't show that, add their vote to the db
                answers[i].userVotes.push(user)
              } else if (!this.state.answers[+ans] && answers[i].userVotes.includes(user)) {
                // If they voted against this option but the db says they voted for it, remove their vote from the db
                let j = answers[i].userVotes.indexOf(user)
                answers[i].userVotes.splice(j, 1)
              }
            }
          }
        }
      }
    } else {
      // If not logged in
      if (typeof this.state.answers === 'string') {
        // If answer selection is radio/single-select
        for (let i = 0; i < answers.length; i++) {
          if (answers[i].answer === this.state.answers) {
            // If they voted for this option
            answers[i].guestVotes += 1
          }
        }
      } else if (typeof this.state.answers === 'object') {
        // If answer selection is checkbox/multi-select
        for (let ans in this.state.answers) {
          for (let i = 0; i < answers.length; i++) {
            if (answers[i].id === +ans) {
              if (this.state.answers[+ans]) {
                // If they voted for this option
                answers[i].guestVotes += 1
              }
            }
          }
        }
      }
    }

    const ans = {
      answers: answers
    }

    this.props.updatePoll(this.props.match.params.id, ans, this.setLocalPoll)
  }

  deleting () {
    this.setState(prevState => ({
      confirmDelete: true
    }))
  }

  confirmingDelete () {
    if (this.state.confirmDelete) {
      this.props.deletePoll(this.props.match.params.id)
    }
    this.props.history.push('/')
  }

  cancelingDelete () {
    this.setState(prevState => ({
      confirmDelete: false
    }))
  }

  componentWillUnmount () {
    this.props.onClearPoll()
    this.setState(prevState => ({
      confirmDelete: false,
      poll: undefined,
      answers: undefined
    }))
  }

  render () {
    return (
      <div className={this.props.classes.poll}>
        <Helmet>
          <title>
            {siteTitle} {this.renderSiteTitle()}
          </title>
        </Helmet>
        {this.renderPageTitle()}
        {this.renderOwner()}
        {this.renderWhichPage()}
      </div>
    )
  }
}

export default withRouter(injectSheet(styles)(Polls))
