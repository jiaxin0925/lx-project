import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: 'header', ...(require('/Users/jiaxin/Desktop/alita-data-portal-frontend/src/models/header.js').default) });
app.model({ namespace: 'model', ...(require('/Users/jiaxin/Desktop/alita-data-portal-frontend/src/layouts/model.js').default) });
app.model({ namespace: 'model', ...(require('/Users/jiaxin/Desktop/alita-data-portal-frontend/src/pages/Product-Flags/Mapping/model.js').default) });
app.model({ namespace: 'model', ...(require('/Users/jiaxin/Desktop/alita-data-portal-frontend/src/pages/Product-Leap/Points/Mapping/model.js').default) });
app.model({ namespace: 'model', ...(require('/Users/jiaxin/Desktop/alita-data-portal-frontend/src/pages/audit/model.js').default) });
app.model({ namespace: 'model', ...(require('/Users/jiaxin/Desktop/alita-data-portal-frontend/src/pages/category/model.js').default) });
app.model({ namespace: 'model', ...(require('/Users/jiaxin/Desktop/alita-data-portal-frontend/src/pages/flags/define/model.js').default) });
app.model({ namespace: 'model', ...(require('/Users/jiaxin/Desktop/alita-data-portal-frontend/src/pages/flags/sequence/model.js').default) });
app.model({ namespace: 'model', ...(require('/Users/jiaxin/Desktop/alita-data-portal-frontend/src/pages/productFlags/model.js').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
