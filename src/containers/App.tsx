/**
 * @file Client app root.
 */

import React, { Fragment, PureComponent } from 'react';
import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Action, bindActionCreators, Dispatch } from 'redux';
import { ThemeProvider } from 'styled-components';
import routes from '../routes';
import { AppState } from '../store';
import { changeLocale, I18nState } from '../store/i18n';
import GlobalStyles from '../styles/global';
import * as theme from '../styles/theme';
import { getLocaleFromPath } from '../utils/i18n';

const debug = (process.env.NODE_ENV === 'development' || __APP_CONFIG__.enableDebugInProduction === true) ? require('debug')('app') : () => {};

interface StateProps {
  i18n: I18nState;
}

interface DispatchProps {
  changeLocale: typeof changeLocale;
}

interface Props extends StateProps, DispatchProps {
  route: RouteComponentProps<{}>;
}

interface State {}

class App extends PureComponent<Props, State> {
  syncLocaleWithUrl() {
    const { route, changeLocale, i18n } = this.props;
    const newLocale = getLocaleFromPath(route.location.pathname);
    if (newLocale === i18n.locale) return;
    changeLocale(newLocale);
  }

  generateRoutes() {
    this.syncLocaleWithUrl();

    return routes.map((route, index) => (
      <Route exact={route.exact} path={route.path} key={`route-${index}`} component={route.component}/>
    ));
  }

  render() {
    const { route } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <Fragment>
          <GlobalStyles/>
          <Switch location={route.location}>{this.generateRoutes()}</Switch>
        </Fragment>
      </ThemeProvider>
    );
  }
}

export default hot(
  connect((state: AppState): StateProps => ({
    i18n: state.i18n,
  }),
  (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({
    changeLocale,
  }, dispatch),
)(App));
