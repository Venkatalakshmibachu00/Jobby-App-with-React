import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  successView = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  submitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = `https://apis.ccbp.in/login`
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      console.log(data)
      this.successView(data.jwt_token)
    } else {
      this.submitFailure(data.error_msg)
    }
  }

  changeUsername = event => {
    this.setState({
      username: event.target.value,
    })
  }

  changePassword = event => {
    this.setState({
      password: event.target.value,
    })
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    const {username, password, showSubmitError, errorMsg} = this.state
    return (
      <div className="login-container">
        <form className="login-form-container" onSubmit={this.submitForm}>
          <div className="logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              className="website-logo"
              alt="website logo"
            />
          </div>
          <label htmlFor="username" className="form-label">
            USERNAME
          </label>
          <input
            type="text"
            value={username}
            className="form-input"
            id="username"
            placeholder="rahul"
            onChange={this.changeUsername}
          />
          <label htmlFor="password" className="form-label">
            PASSWORD
          </label>
          <input
            type="password"
            className="form-input"
            value={password}
            id="password"
            placeholder="rahul@2021"
            onChange={this.changePassword}
          />
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="error-msg">{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
