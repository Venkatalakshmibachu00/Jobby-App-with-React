import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import FiltersGroup from '../FiltersGroup'

import JobCard from '../JobCard'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const failureViewImg =
  'https://assets.ccbp.in/frontend/react-js/failure-img.png'

class JobSection extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    searchInput: '',
    jobsData: [],
    activeSalaryRangeId: '',
    activeCheckBoxList: [],
  }

  componentDidMount() {
    this.getJobsData()
  }

  getJobsData = async () => {
    const {searchInput, activeSalaryRangeId, activeCheckBoxList} = this.state
    this.setState({
      apiStatus: apiStatusConstants.loading,
    })
    const jwtToken = Cookies.get('jwt_token')
    const activeEmploymentId = activeCheckBoxList.join(',')
    const url = `https://apis.ccbp.in/jobs?search=${searchInput}&minimum_package=${activeSalaryRangeId}&employment_type=${activeEmploymentId}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedDataJobs = data.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobsData: updatedDataJobs,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onGetJobsView = () => {
    const {jobsData} = this.state
    const noJobs = jobsData.length === 0
    return noJobs ? (
      <div className="no-jobs-container">
        <img
          className="no-jobs-img"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No jobs found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    ) : (
      <ul className="ul-job-items-container">
        {jobsData.map(eachItem => (
          <JobCard key={eachItem.id} jobData={eachItem} />
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onGetJobsFailureView = () => (
    <div className="failure-img-button-container">
      <img className="failure-img" src={failureViewImg} alt="failure view" />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-paragraph">
        we cannot seem to find the page you are looking for
      </p>
      <div className="jobs-failure-button-container">
        <button
          className="failure-button"
          type="button"
          onClick={this.onRetryJobs}
        >
          Retry
        </button>
      </div>
    </div>
  )

  onRenderJobsStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onGetJobsView()
      case apiStatusConstants.failure:
        return this.onGetJobsFailureView()
      case apiStatusConstants.loading:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onGetSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  onChangeSalary = salaryRangeId => {
    this.setState({activeSalaryRangeId: salaryRangeId}, this.getJobsData)
  }

  handleCheckBoxChange = (isChecked, employmentTypeId) => {
    const {activeCheckBoxList} = this.state
    let updatedActiveCheckBoxList
    if (isChecked) {
      updatedActiveCheckBoxList = [...activeCheckBoxList, employmentTypeId]
    } else {
      updatedActiveCheckBoxList = activeCheckBoxList.filter(
        id => id !== employmentTypeId,
      )
    }
    this.setState(
      {activeCheckBoxList: updatedActiveCheckBoxList},
      this.getJobsData,
    )
  }

  render() {
    const {searchInput, activeCheckBoxList} = this.state
    return (
      <div className="all-jobs-container">
        <FiltersGroup
          employmentTypesList={employmentTypesList}
          salaryRangesList={salaryRangesList}
          onChangeSalary={this.onChangeSalary}
          activeCheckBoxList={activeCheckBoxList}
          onCheckBoxChange={this.handleCheckBoxChange}
        />
        <div className="jobs-container">
          <div className="search-container">
            <input
              type="search"
              placeholder="Search"
              className="search-input"
              value={searchInput}
              onChange={this.onGetSearchInput}
              onKeyDown={this.onEnterSearchInput}
            />
            <button
              data-testid="searchButton"
              type="button"
              className="search-button"
              onClick={this.onSubmitSearchInput}
            >
              <AiOutlineSearch className="search-icon" />
            </button>
          </div>
          {this.onRenderJobsStatus()}
        </div>
      </div>
    )
  }
}

export default JobSection
