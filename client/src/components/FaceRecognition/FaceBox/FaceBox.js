import React from 'react';
import FaceBoxClasses from './FaceBox.module.css';

const FaceBox = props => {
  const {
    faceBox,
    mousedOver,
    currentFaceBoxId,
    onMouseOverFaceBox,
    onMouseOutFaceBox,
  } = props;
  return (
    <div
      className={FaceBoxClasses.FaceBox}
      style={{
        top:
          faceBox.top -
          (mousedOver && currentFaceBoxId === faceBox.id ? 0.5 : 0) +
          '%',
        left:
          faceBox.left -
          (mousedOver && currentFaceBoxId === faceBox.id ? 0.5 : 0) +
          '%',
        right:
          faceBox.right -
          (mousedOver && currentFaceBoxId === faceBox.id ? 0.5 : 0) +
          '%',
        bottom:
          faceBox.bottom -
          (mousedOver && currentFaceBoxId === faceBox.id ? 0.5 : 0) +
          '%',
        opacity: !mousedOver || currentFaceBoxId === faceBox.id ? 1 : 0.6,
      }}
      onMouseOver={onMouseOverFaceBox}
      onMouseOut={onMouseOutFaceBox}
    ></div>
  );
};

export default FaceBox;
