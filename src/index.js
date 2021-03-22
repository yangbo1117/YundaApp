import  "react-app-polyfill/ie11";  //如果您支持Internet Explorer 9或Internet Explorer 11，则应同时包含ie9或ie11和stable模块
import  "react-app-polyfill/stable";
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './utils/rem' 
import Router from './router/router';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Router />, document.getElementById('root'));
serviceWorker.unregister();
