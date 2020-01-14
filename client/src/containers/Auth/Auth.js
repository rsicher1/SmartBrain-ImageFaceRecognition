import React, { useState, useEffect, useCallback } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import AuthV from '../../components/Auth/Auth';

const Auth = props => {
  const {
    signedIn,
    history,
    setUserId,
    setEntries,
    setName,
    updateUserCredentialsHandler,
    setSignedIn,
  } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameText, setNameText] = useState('');

  useEffect(() => {
    if (signedIn) {
      return history.push('/');
    }
  }, [signedIn, history]);

  const registerHandler = useCallback(
    async (email, password, name) => {
      try {
        const res = await fetch('http://localhost:8080/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            name,
            email,
            password,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();
        if (data.message === 'Successfully registered') {
          setEmail('');
          setPassword('');
          setNameText('');
          return history.push('/signin');
        }
      } catch (err) {
        console.log(err);
      }
    },
    [history]
  );

  const signinHandler = useCallback(
    async (email, password) => {
      try {
        const res = await fetch('http://localhost:8080/api/auth/signin', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();
        if (data.message === 'Successfully signed in') {
          setUserId(data.user.id);
          setName(data.user.name);
          setEntries(data.user.entries);
          updateUserCredentialsHandler(data);
          setSignedIn(true);
          setEmail('');
          setPassword('');
          return history.push('/');
        }
      } catch (err) {
        console.log(err);
      }
    },
    [
      history,
      updateUserCredentialsHandler,
      setEntries,
      setUserId,
      setName,
      setSignedIn,
    ]
  );

  return (
    <Switch>
      <Route
        exact
        path="/signin"
        render={props => (
          <AuthV
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            type="signin"
            header="Sign In"
            linkPath="/register"
            linkText="Register"
            signedIn={signedIn}
            onButtonClick={signinHandler}
            {...props}
          />
        )}
      />
      <Route
        exact
        path="/register"
        render={props => (
          <AuthV
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            name={nameText}
            setName={setNameText}
            type="register"
            header="Register"
            linkPath="/signin"
            linkText="Sign In"
            signedIn={signedIn}
            onButtonClick={registerHandler}
            {...props}
          />
        )}
      />
    </Switch>
  );
};

export default withRouter(Auth);
