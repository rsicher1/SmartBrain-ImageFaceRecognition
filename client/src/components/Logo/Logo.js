import React from 'react';
import Tilt from 'react-tilt';
import TiltClasses from './Logo.module.css';
import brain from './brain.png';

const Logo = () => {
  return (
    <div className="ma4 mt0">
      <Tilt
        className={`Tilt ${TiltClasses.Background} br2 shadow-2`}
        options={{ max: 55 }}
        style={{ height: 200, width: 200 }}
      >
        <div className="Tilt-inner pt3">
          <img
            className={TiltClasses.Image}
            style={{ paddingTop: '10px' }}
            src={brain}
            alt="smart-brain"
          />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
