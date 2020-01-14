import React from 'react';
import { Link } from 'react-router-dom';

const Auth = props => {
  const { email, setEmail, password, setPassword, name, setName } = props;
  return (
    <div className="br3 ba b--black-10 mb4 w-100 w-75-m w-50-l mw6 shadow-5 center">
      <main className="pa4 w-100 black-80 tl">
        <form className="measure">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0">{props.header}</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="email-address">
                Email
              </label>
              <input
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="email"
                name="email-address"
                id="email-address"
                onChange={e => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="password">
                Password
              </label>
              <input
                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="password"
                name="password"
                id="password"
                onChange={e => setPassword(e.target.value)}
                value={password}
              />
            </div>
            {props.type === 'register' && (
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="name">
                  Name
                </label>
                <input
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="text"
                  name="name"
                  id="name"
                  onChange={e => setName(e.target.value)}
                  value={name}
                />
              </div>
            )}
          </fieldset>
          <div className="">
            <button
              onClick={props.onButtonClick.bind(this, email, password, name)}
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
              type="button"
            >
              Submit
            </button>
          </div>
          <div className="lh-copy mt3">
            <Link to={props.linkPath} className="f6 link dim black db">
              {props.linkText}
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Auth;
