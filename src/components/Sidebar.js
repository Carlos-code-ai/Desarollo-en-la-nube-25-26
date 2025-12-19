import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav className="w3-sidebar w3-bar-block w3-white w3-collapse w3-top" style={{zIndex:3,width:"300px"}} id="mySidebar">
      <div className="w3-container w3-display-container w3-padding-16">
        <i onClick={() => window.w3_close()} className="fa fa-remove w3-hide-large w3-button w3-display-topright"></i>
        <h3 className="w3-wide"><b>READY2WEAR</b></h3>
      </div>
      <div className="w3-padding-64 w3-large w3-text-grey" style={{fontWeight:"bold"}}>
        <Link to="/login" className="w3-bar-item w3-button">Login</Link>
        <Link to="/signup" className="w3-bar-item w3-button">Sign Up</Link>
        <Link to="/add-suit" className="w3-bar-item w3-button">Add Suit</Link>
      </div>
    </nav>
  );
};

export default Sidebar;
