import React from 'react';
import { withRouter } from 'react-router-dom';

import GameStatsDisplay from '../game/stats/game_stats_display';

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      passwordConfirmation: '',
      errors: {},
      errorPasswordMismatch: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearedErrors = false;
  }

  // componentDidMount() {
  //   this.props.fetchGameStats();
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps.signedIn === true) {
      this.props.history.push('/login');
    }

    this.setState({errors: nextProps.errors})
  }

  update(field) {
    return e => this.setState({
      [field]: e.currentTarget.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    // debugger
    if (this.state.password !== this.state.passwordConfirmation) {
      debugger
      this.setState({ errorPasswordMismatch: true })
      
    } else {
      // debugger
      let user = {
        username: this.state.username,
        password: this.state.password,
      };
  
      this.props.signup(user, this.props.history); 
    }

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
            <h3>Signup</h3>
            <input className="placeholder-text"type="text"
              value={this.state.username}
              onChange={this.update('username')}
              placeholder="Username"
            />
            <input className="placeholder-text" type="password"
              value={this.state.password}
              onChange={this.update('password')}
              placeholder="Password"
            />
            <input className="placeholder-text" type="password"
              value={this.state.passwordConfirmation}
              onChange={this.update('passwordConfirmation')}
              placeholder="Confirm Password"
            />
            {this.state.errorPasswordMismatch ? 
              <p
                style={{
                  fontSize: "20px",
                  padding: "2px 10px",
                  color: "#DD4B47",
                  fontWeight: "800"
                }}
              >
                **Password mismatch**
              </p> 
              : 
              null}
            <input className="submit-link-button" type="submit" value="Submit" />
            {this.renderErrors()}
          </form>
        </div>
        <div className="high-scores-container">
          <GameStatsDisplay />
        </div>
      </div>
    );
  }
}

export default withRouter(SignupForm);