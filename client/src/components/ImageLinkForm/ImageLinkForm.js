import React from 'react';
import ImageLinkFormClasses from './ImageLinkForm.module.css';

const ImageLinkForm = props => {
  return (
    <div className="ma4 mt0">
      <p className="f3">This magic brain will detect faces in pictures</p>

      <div className="center">
        <div className={`${ImageLinkFormClasses.form} pa4 br3 shadow-5 center`}>
          <input
            onChange={props.onInputChange}
            value={props.tempImageUrl}
            className="f4 pa2 w-70 center"
            type="text"
          />
          <button
            onClick={props.onDetectClick}
            className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple"
          >
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
