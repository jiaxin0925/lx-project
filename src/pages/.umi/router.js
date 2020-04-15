import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@tmp/history';
import RendererWrapper0 from '/Users/jiaxin/Desktop/alita-data-portal-frontend/src/pages/.umi/LocaleWrapper.jsx';
import { routerRedux } from 'dva';

const Router = routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/',
    component: require('../../layouts/index.js').default,
    routes: [
      {
        path: '/Product-Flags/Mapping',
        exact: true,
        component: require('../Product-Flags/Mapping/index.jsx').default,
        _title: 'DPC-DATA-MANAGEMENT-PORTAL',
        _title_default: 'DPC-DATA-MANAGEMENT-PORTAL',
      },
      {
        path: '/Product-Leap/Points/Mapping',
        exact: true,
        component: require('../Product-Leap/Points/Mapping/index.jsx').default,
        _title: 'DPC-DATA-MANAGEMENT-PORTAL',
        _title_default: 'DPC-DATA-MANAGEMENT-PORTAL',
      },
      {
        path: '/audit',
        exact: true,
        component: require('../audit/index.jsx').default,
        _title: 'DPC-DATA-MANAGEMENT-PORTAL',
        _title_default: 'DPC-DATA-MANAGEMENT-PORTAL',
      },
      {
        path: '/category/category',
        exact: true,
        component: require('../category/category.jsx').default,
        _title: 'DPC-DATA-MANAGEMENT-PORTAL',
        _title_default: 'DPC-DATA-MANAGEMENT-PORTAL',
      },
      {
        path: '/flags/define',
        exact: true,
        component: require('../flags/define/index.jsx').default,
        _title: 'DPC-DATA-MANAGEMENT-PORTAL',
        _title_default: 'DPC-DATA-MANAGEMENT-PORTAL',
      },
      {
        path: '/flags/sequence',
        exact: true,
        component: require('../flags/sequence/index.jsx').default,
        _title: 'DPC-DATA-MANAGEMENT-PORTAL',
        _title_default: 'DPC-DATA-MANAGEMENT-PORTAL',
      },
      {
        path: '/',
        exact: true,
        component: require('../index.js').default,
        _title: 'DPC-DATA-MANAGEMENT-PORTAL',
        _title_default: 'DPC-DATA-MANAGEMENT-PORTAL',
      },
      {
        path: '/productFlags/productFlags',
        exact: true,
        component: require('../productFlags/productFlags.jsx').default,
        _title: 'DPC-DATA-MANAGEMENT-PORTAL',
        _title_default: 'DPC-DATA-MANAGEMENT-PORTAL',
      },
      {
        component: () =>
          React.createElement(
            require('/Users/jiaxin/Desktop/alita-data-portal-frontend/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: false },
          ),
        _title: 'DPC-DATA-MANAGEMENT-PORTAL',
        _title_default: 'DPC-DATA-MANAGEMENT-PORTAL',
      },
    ],
    _title: 'DPC-DATA-MANAGEMENT-PORTAL',
    _title_default: 'DPC-DATA-MANAGEMENT-PORTAL',
  },
  {
    component: () =>
      React.createElement(
        require('/Users/jiaxin/Desktop/alita-data-portal-frontend/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: false },
      ),
    _title: 'DPC-DATA-MANAGEMENT-PORTAL',
    _title_default: 'DPC-DATA-MANAGEMENT-PORTAL',
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    routeChangeHandler(history.location);
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
