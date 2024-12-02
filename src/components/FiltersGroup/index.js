import Cookies from 'js-cookie'
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './index.css'

const apiJobsStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class FiltersGroup extends Component {
  state = {
    apiStatus: apiJobsStatusConstants.initial,
    profileData: {},
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({
      apiStatus: apiJobsStatusConstants.initial,
    })
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/profile`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const userDetails = data.profile_details
      const updatedData = {
        imageUrl: userDetails.profile_image_url,
        name: userDetails.name,
        shortBio: userDetails.short_bio,
      }
      //   console.log(updatedData)
      this.setState({
        profileData: updatedData,
        apiStatus: apiJobsStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiJobsStatusConstants.failure,
      })
    }
  }

  onRetryProfile = () => {
    // this.onGetProfileDetails()
    this.getJobDetails()
  }

  onGetProfileFailureView = () => (
    <div className="failure-button-container">
      <button
        className="failure-button"
        type="button"
        onClick={this.onRetryProfile}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onGetProfileView = () => {
    const {profileData} = this.state
    const {name, imageUrl, shortBio} = profileData
    return (
      <div className="profile-container">
        <img src={imageUrl} className="profile-icon" alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-description">{shortBio}</p>
      </div>
    )
  }

  onRenderProfileStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiJobsStatusConstants.success:
        return this.onGetProfileView()
      case apiJobsStatusConstants.failure:
        return this.onGetProfileFailureView()
      case apiJobsStatusConstants.loading:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderSalaryRange = () => {
    const {salaryRangesList, onChangeSalary} = this.props

    return salaryRangesList.map(each => {
      const changeSalaryRange = () => {
        onChangeSalary(each.salaryRangeId)
      }

      return (
        <li
          className="li-container"
          key={each.salaryRangeId}
          onChange={changeSalaryRange}
        >
          <input
            name="option"
            className="radio"
            id={each.salaryRangeId}
            type="radio"
          />
          <label className="label" htmlFor={each.salaryRangeId}>
            {each.label}
          </label>
        </li>
      )
    })
  }

  renderTypeOfEmployment = () => {
    const {
      employmentTypesList,
      onCheckBoxChange,
      activeCheckBoxList,
    } = this.props
    return employmentTypesList.map(eachItem => {
      const handleCheckBoxChange = (isChecked, employmentTypeId) => {
        onCheckBoxChange(isChecked, employmentTypeId)
      }

      return (
        <li className="li-container" key={eachItem.employmentTypeId}>
          <input
            checked={activeCheckBoxList.includes(eachItem.employmentTypeId)}
            onChange={e =>
              handleCheckBoxChange(e.target.checked, eachItem.employmentTypeId)
            }
            id={eachItem.employmentTypeId}
            type="checkbox"
          />
          <label className="label" htmlFor={eachItem.employmentTypeId}>
            {eachItem.label}
          </label>
        </li>
      )
    })
  }

  render() {
    return (
      <div className="side-bar-container">
        {this.onRenderProfileStatus()}
        <hr className="hr-line" />
        <h1 className="text">Type of Employment</h1>
        <ul className="check-boxes-container">
          {this.renderTypeOfEmployment()}
        </ul>
        <hr className="hr-line" />
        <h1 className="text">Salary Range</h1>
        <ul className="radio-button-container">{this.renderSalaryRange()}</ul>
      </div>
    )
  }
}

export default FiltersGroup
