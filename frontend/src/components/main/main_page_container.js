import { connect } from 'react-redux';
import { login } from '../../actions/session_actions';
// import { fetchGameStats } from '../../actions/game_stats_actions';

import MainPage from './main_page';

const mapStateToProps = (state) => {
  // let gameStats = state.entities.stats;
  return {
    errors: state.errors.session
    // gameStats
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: user => dispatch(login(user))
    // fetchGameStats: () => dispatch(fetchGameStats())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainPage);