import React, {
  Fragment,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import Particles from 'react-particles-js';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';

import Navigation from '../components/Navigation/Navigation';
import Auth from './Auth/Auth';
import Main from './Main/Main';

import './App.css';

// https://samples.clarifai.com/face-det.jpg
// https://image.shutterstock.com/image-photo/happy-cheerful-young-woman-wearing-600w-613759379.jpg
// https://www.uni-regensburg.de/Fakultaeten/phil_Fak_II/Psychologie/Psy_II/beautycheck/english/durchschnittsgesichter/m(01-32)_gr.jpg
// https://66.media.tumblr.com/7b2f5000bf83acd8a61479965c384244/tumblr_p5vlkwrjyK1r4x5j7o1_1280.jpg

const particlesOptions = {
  particles: {
    number: {
      value: 20,
      density: {
        enable: true,
        value_area: 800,
      },
    },
  },
};

const App = props => {
  const { history } = props;

  const timer = useRef();
  const [runOnce, setRunOnce] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState(null);
  const [entries, setEntries] = useState(null);
  const [tokenExpiryDate, setTokenExpiryDate] = useState(null);

  const signoutHandler = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');

    clearTimeout(timer.current);

    setToken(null);
    setUserId(null);
    setTokenExpiryDate(null);
    setEntries(null);
    setSignedIn(false);
    history.push('/signin');
  }, [history]);

  const updateUserCredentialsHandler = useCallback(
    data => {
      const remainingMilliseconds = 60 * 60 * 1000;

      clearTimeout(timer.current);

      timer.current = setTimeout(() => {
        signoutHandler();
      }, remainingMilliseconds);

      const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
      localStorage.setItem('token', data.token);
      localStorage.setItem('expiryDate', expiryDate.toISOString());
      setToken(data.token);
      setTokenExpiryDate(expiryDate.toISOString());
    },
    [signoutHandler]
  );

  useEffect(() => {
    (async () => {
      if (!runOnce) {
        const expiryDate = localStorage.getItem('expiryDate');
        if (expiryDate && new Date() > new Date(expiryDate)) {
          return signoutHandler();
        } else {
          try {
            const token = localStorage.getItem('token');
            if (token) {
              const res = await fetch('http://localhost:8080/api/auth/token', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              });

              const data = await res.json();

              if (data.message === 'Successfully signed in') {
                setUserId(data.user.id);
                setName(data.user.name);
                setEntries(data.user.entries);
                updateUserCredentialsHandler(data);
                setSignedIn(true);
                history.push('/');
              } else {
                history.push('/signin');
              }
            }
          } catch (err) {
            console.log(err);
          }
          document.onvisibilitychange = () => {
            if (signedIn) {
              if (expiryDate && new Date() > new Date(expiryDate)) {
                signoutHandler();
              }
            }
          };
        }
        setRunOnce(true);
      }
    })();
    return () => clearTimeout(timer.current);
  }, [
    runOnce,
    signedIn,
    history,
    updateUserCredentialsHandler,
    signoutHandler,
  ]);

  return (
    <div className="App">
      {runOnce && (
        <Fragment>
          <Particles params={particlesOptions} className="particles" />
          <Navigation onSignout={signoutHandler} signedIn={signedIn} />
          <Auth
            signedIn={signedIn}
            setSignedIn={setSignedIn}
            setName={setName}
            updateUserCredentialsHandler={updateUserCredentialsHandler}
            setEntries={setEntries}
            setUserId={setUserId}
          />
          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <Main
                  onSignout={signoutHandler}
                  name={name}
                  token={token}
                  userId={userId}
                  entries={entries}
                  setEntries={setEntries}
                  onUpdateUserCredentials={updateUserCredentialsHandler}
                  signedIn={signedIn}
                  {...props}
                />
              )}
            />
            {signedIn && <Redirect to="/" />}
            <Redirect to="/signin" />
          </Switch>
        </Fragment>
      )}
      {!runOnce && <p>Loading...</p>}
    </div>
  );
};

export default withRouter(App);
