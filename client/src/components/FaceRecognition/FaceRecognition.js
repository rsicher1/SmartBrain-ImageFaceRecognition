import React, { useState, useCallback } from 'react';
import FaceBox from './FaceBox/FaceBox';

const FaceRecognition = props => {
  const [mousedOver, setMousedOver] = useState(false);
  const [currentFaceBoxId, setCurrentFaceBoxId] = useState('');

  const mouseOverFaceBoxHandler = useCallback(id => {
    setMousedOver(true);
    setCurrentFaceBoxId(id);
  }, []);

  const mouseOutFaceBoxHandler = useCallback(() => {
    setMousedOver(false);
  }, []);

  return (
    <div
      className="center"
      style={{
        visibility: props.detected && !props.loading ? 'visible' : 'hidden',
      }}
    >
      <div style={{ position: 'relative' }}>
        {props.faceBoxes &&
          props.faceBoxes.map(faceBox => {
            return (
              <FaceBox
                key={faceBox.id}
                faceBox={faceBox}
                currentFaceBoxId={currentFaceBoxId}
                mousedOver={mousedOver}
                onMouseOutFaceBox={mouseOutFaceBoxHandler}
                onMouseOverFaceBox={mouseOverFaceBoxHandler.bind(
                  this,
                  faceBox.id
                )}
              />
            );
          })}
        <img
          ref={props.imageRef}
          style={{ maxWidth: '500px', height: 'auto' }}
          src={props.imageUrl}
          alt="face detection"
          onLoad={props.onImageLoad}
        />
      </div>
    </div>
  );
};

export default FaceRecognition;
