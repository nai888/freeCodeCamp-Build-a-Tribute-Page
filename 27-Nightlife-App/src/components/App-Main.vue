<template>
  <main class="main">
    <h2 class="title">What plans do you have tonight?</h2>
    <p class="subtitle">Today is {{ formattedDate }}.</p>
    <SearchArea @on-submit="submit" />
    <ResultsArea :bars="bars" @on-going="onGoing" />
  </main>
</template>

<script>
import SearchArea from './Search-Area'
import ResultsArea from './Results-Area'

export default {
  name: 'AppMain',
  components: {
    SearchArea,
    ResultsArea
  },
  data () {
    return {
      date: new Date(),
      user: {
        id: '213767501', // me = '213767501'
        sn: 'ianacook' // me = 'ianacook'
      },
      location: '',
      bars: []
    }
  },
  computed: {
    formattedDate: function () {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      return `${days[this.date.getDay()]}, ${months[this.date.getMonth()]} ${this.date.getDate()}, ${this.date.getFullYear()}`
    }
  },
  methods: {
    submit: function (location) {
      this.location = 'searching'
      fetch(`/api/bars?loc=${encodeURIComponent(location)}`)
        .then(res => {
          this.location = 'loading'
          return res.json()
        })
        .catch(err => {
          this.location = 'error'
          console.error(err)
        })
        .then(bars => {
          this.location = location
          this.bars = bars
        })
    },
    onGoing: function (barId) {
      if (this.user.id.length) {
        console.log(`Going to ${barId}!`)
      } else {
        // document.location = `${document.location}api/auth?id=${barId}`
        fetch('/api/auth')
          .then(res => {
            console.log(res)
            return res.json()
          })
          .catch(err => {
            console.error(err)
          })
          .then(user => {
            this.user = user
            console.log(this.user)
          })
      }
    }
  }
}
</script>

<style scoped>
.main {
  margin-top: 2rem;
  margin-bottom: 2rem;
  min-height: 400px;
}

.title, .subtitle {
  text-align: center;
}

.subtitle {
  font-style: italic;
}
</style>
