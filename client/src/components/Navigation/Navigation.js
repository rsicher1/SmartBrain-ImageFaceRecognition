import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = props => {
  return props.signedIn ? (
    <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <p
        onClick={props.onSignout}
        className="f3 link dim black underline pa3 pointer mv4"
      >
        Sign Out
      </p>
    </nav>
  ) : (
    <Fragment>
      <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <NavLink
          activeClassName="white"
          to="/signin"
          className="f3 link dim black underline pa3 pointer mv4"
        >
          Sign In
        </NavLink>

        <NavLink
          activeClassName="white"
          to="register"
          className="f3 link dim black underline pa3 pointer mv4"
        >
          Register
        </NavLink>
      </nav>
    </Fragment>
  );
};

export default Navigation;
