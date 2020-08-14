import React from 'react';
import { withRouter } from 'react-router-dom';

import GameStatsDisplay from '../game/stats/game_stats_display';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      errors: {}
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderErrors = this.renderErrors.bind(this);
  }

  // componentDidMount() {
  //   this.props.fetchGameStats();
  // }

  update(field) {
    return e => this.setState({
      [field]: e.currentTarget.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    let user = {
      username: this.state.username,
      password: this.state.password
    };

    this.props.login(user); 
  }

  handleDemoLogin(e) {
    // e.preventDefault();
    console.log("login pressed")

    let user = {  
      username: "Mx. Demo",
      password: "123456"
    };

    this.props.login(user);
  }

  renderErrors() {
    return(
      <ul>
        {Object.keys(this.state.errors).map((error, i) => (
          <li key={`error-${i}`}>
            {this.state.errors[error]}
          </li>
        ))}
      </ul>
    );
  }

  render() {
    // let stats = this.props.gameStats;

    return (
      <div className="session-page-content">
        <div className="session-form-container">
          <form className="session-form" onSubmit={this.handleSubmit}>
            <h3>Login</h3>
            <input type="text"
              value={this.state.username}
              onChange={this.update('username')}
              placeholder="Username"
            />
            <input type="password"
              value={this.state.password}
              onChange={this.update('password')}
              placeholder="Password"
            />
            <input className="submit-link-button" type="submit" value="Submit" />

            <button className="submit-link-button" onClick={()=>this.handleDemoLogin()}>
              Demo Login
            </button>
            
            {this.renderErrors()}
          </form>
        </div>
        <div className="high-scores-container">
          <GameStatsDisplay />
        </div>
      </div >
    );
  }
}

export default withRouter(LoginForm);