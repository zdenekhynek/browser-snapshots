import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import IpadLanding from './landing';
import IpadRaces from './races';
import IpadResults from './results';
import IpadHighlights from './highlights';
import { initSocket } from '../sockets/socket_service';
import { receiveCreateRace, receiveUpdateRace } from '../races/action_creators';

class Ipad extends Component {
  constructor(props) {
    super(props);

    //  subscribe to the ipad group
    initSocket('ipad', this.onSocketMessage.bind(this));
  }

  onSocketMessage(socketData) {
    const { history } = this.props;
    const { message } = socketData;

    if (message === 'session_start') {
      const racesLink = '/viz/ipad/races/';
      history.push(racesLink);
    } else if (message === 'restart') {
      const landingLink = '/viz/ipad/landing/';
      history.push(landingLink);
    } else if (message === 'race_started') {
      const raceLink = `/viz/ipad/races/${socketData.id}`;
      history.push(raceLink);
      this.props.receiveCreateRace(socketData);
    } else if (message === 'race_update') {
      this.props.receiveUpdateRace(socketData.id, socketData);
    } else if (message === 'race_finished') {
      const finishLink = `/viz/ipad/races/${socketData.id}/results`;
      history.push(finishLink);
      this.props.receiveUpdateRace(socketData.id, socketData);
    }
  }

  render() {
    return (
      <Fragment>
        <Route exact path="/viz/ipad/landing" component={IpadLanding} />
        <Route exact path="/viz/ipad/races/" component={IpadRaces} />
        <Route
          exact
          path="/viz/ipad/races/:raceId"
          render={({ match }) => {
            const { params } = match;
            const { raceId } = params;

            return (<IpadRaces raceId={+raceId} />);
          }}
        />
        <Route
          exact
          path="/viz/ipad/races/:raceId/results"
          render={({ match }) => {
            const { params } = match;
            const { raceId } = params;

            return (<IpadResults raceId={+raceId} />);
          }}
        />
        <Route exact path="/viz/ipad/highlights" component={IpadHighlights} />
      </Fragment>
    );
  }
}

export function mapStateToProps({ agents, metrics, races }) {
  return {};
}

Ipad.propTypes = {
  className: PropTypes.string,
};

Ipad.defaultProps = {
  className: '',
};

export default connect(
  mapStateToProps,
  { receiveCreateRace, receiveUpdateRace }
)(withRouter(Ipad));
