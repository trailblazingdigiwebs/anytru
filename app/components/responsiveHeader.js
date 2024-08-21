import React from 'react';
import Header from './header';
import MobileHeader from './mobileHeader';


const ResponsiveHeader = () => {
  return (
    <div className="headerContainer">
      <div className="desktopHeader">
        <Header />
      </div>
      <div className="mobileHeader">
        <MobileHeader />
      </div>
    </div>
  );
};

export default ResponsiveHeader;
