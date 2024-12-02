import {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

class Home extends Component {
  findJobs = () => {
    const {history} = this.props
    history.replace('/jobs')
  }

  render() {
    return (
      <div>
        <Header />
        <div className="home-container">
          <div className="container">
            <h1 className="heading">Find The Job That Fits Your Life</h1>
            <p className="description">
              Millions of people are searching for jobs, salary information,
              company reviews. Find the job that fits your abilities and
              potential.
            </p>
            <Link to="/jobs">
              <button
                onClick={this.findJobs}
                type="button"
                className="find-jobs"
              >
                Find Jobs
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
