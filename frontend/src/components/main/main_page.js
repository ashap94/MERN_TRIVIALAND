import React from 'react';
import '../css/pre_post_game.css';
import { Link } from 'react-router-dom';


class MainPage extends React.Component {

  handleDemoLogin(e) {
    // e.preventDefault();
    console.log("login pressed")

    let user = {  
      username: "Mx. Demo",
      password: "123456"
    };

    this.props.login(user);
  }

  render() {
    return (
      
      <div className="main-page-content">
        <div className="main-page-links">
          <Link className="link-button-main" to={'/signup'}>Signup</Link>
          <Link className="link-button-main" to={'/login'}>Login</Link>
          <div className="link-button-main demo" onClick={()=>this.handleDemoLogin()}>Demo</div>
        </div>
        <div className="creators-box">
          <h3>Created by:</h3>
          <ul className="creators-list">
            <li>
              <p>Aaron Shapiro</p>
              <a href="https://github.com/ashap94">GitHub</a>
              <a href="https://www.linkedin.com/in/aaron-shapiro1994/">LinkedIn</a>
              <a href="mailto: aaronshapiro94@gmail.com">Email</a>
            </li>
            <li>
              <p>Ben Rawner</p>
              <a href="https://github.com/RawBData">GitHub</a>
              <a href="https://www.linkedin.com/in/benjaminrawner/">LinkedIn</a>
              <a href="mailto: benraw11@gmail.com">Email</a>
            </li>
            <li>
              <p>Jordan Black</p>
              <a href="https://github.com/jbotoro">GitHub</a>
              <a href="https://www.linkedin.com/in/jordan-black-a88b0481/">LinkedIn</a>
              <a href="mailto: jblack530@gmail.com">Email</a>
            </li>
            <li>
              <p>Kevin Moch</p>
              <a href="https://github.com/kedholmmoch">GitHub</a>
              <a href="https://www.linkedin.com/in/kevin-edholm-moch/">LinkedIn</a>
              <a href="mailto: kevin.edholm.moch@gmail.com">Email</a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default MainPage;