import React, { Component } from 'react';

import Sidebar from '../../components/Sidebar/Sidebar';

import classes from './Layout.module.css';

class Layout extends Component {

  render() {
    return (
      <div className={classes.Container}>
        <div className={classes.Sidebar}>
          <Sidebar />
        </div>

        <div className={classes.MainContent}>
        </div>
      </div>
      );
  }
}

export default Layout;