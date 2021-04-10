import 'es6-promise/auto';
import 'core-js/es/map';
import 'core-js/es/set';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

import routes from './router';

import '@/scss/global.scss';

ReactDOM.render(
  <HashRouter>
    {renderRoutes(routes)}
  </HashRouter>,
  document.getElementById('app')
);
