import React from 'react';
import { Link } from 'react-router-dom'
import './navbar.css'
import logo from '../../assets/trivialand_logo.png';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.logoutUser = this.logoutUser.bind(this);
    this.getLinks = this.getLinks.bind(this);
  }

  componentDidMount(){

  }

  logoutUser(e) {
      e.preventDefault();
      this.props.logout();
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

  getLinks() {
      if (this.props.loggedIn) {
        return (
            <div className="navbar-links-container">
                <Link className="link-button" to={'/profile'}>Profile</Link>
                <button className="link-button" onClick={this.logoutUser}>Logout</button>
            </div>
        );
      } else {
        return (
            <div className="navbar-links-container">
                <Link className="link-button" to={'/signup'}>Signup</Link>
                <Link className="link-button" to={'/login'}>Login</Link>
                <div className="link-button demo"  onClick={()=>this.handleDemoLogin()}>Demo</div>
            </div>
        );
      }
  }

  render() {
      return (
        <div className="navvy">
          <li>
            <a href="https://trivialand-app.herokuapp.com/">
              <img src={logo} alt="Logo" />
            </a>
          </li>
          
          { this.getLinks() }
        </div>
      );
  }
}

export default NavBar;