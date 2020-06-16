import { connect } from 'react-redux';
import { logout, login } from '../../actions/session_actions';

import NavBar from './navbar';

const mapStateToProps = (state) => {
  // let gameStats = state.entities.stats;
  return {
    errors: state.errors.session,
    loggedIn: state.session.isAuthenticated
    // gameStats
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: user => dispatch(login(user)),
    logout: ()=>dispatch(logout())
    // fetchGameStats: () => dispatch(fetchGameStats())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBar);