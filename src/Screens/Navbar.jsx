import React from 'react';
import gfgicon from '../Images/gfg.jpg'
const Navbar = () => {
  return (
    <>
      <nav className="navbar  ">
        <div className="container">
          <span className="navbar-brand">
            <img
              src={gfgicon}
              alt="gfgicon"
              width="60"
              height="60"
              style={{color:"black",background:"black",borderRadius:"50%"}}
            />
          </span>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
