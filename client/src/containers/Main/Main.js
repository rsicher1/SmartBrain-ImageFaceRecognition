import React, {
  Fragment,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import Clarifai from 'clarifai';

import Logo from '../../components/Logo/Logo';
import ImageLinkForm from '../../components/ImageLinkForm/ImageLinkForm';
import Entries from '../../components/Entries/Entries';
import FaceRecognition from '../../components/FaceRecognition/FaceRecognition';

// https://samples.clarifai.com/face-det.jpg
// https://image.shutterstock.com/image-photo/happy-cheerful-young-woman-wearing-600w-613759379.jpg
// https://www.uni-regensburg.de/Fakultaeten/phil_Fak_II/Psychologie/Psy_II/beautycheck/english/durchschnittsgesichter/m(01-32)_gr.jpg
// https://66.media.tumblr.com/7b2f5000bf83acd8a61479965c384244/tumblr_p5vlkwrjyK1r4x5j7o1_1280.jpg

const clarifai = new Clarifai.App({
  apiKey: process.env.REACT_APP_CLARIFAI_API_KEY,
});

const Main = props => {
  const {
    signedIn,
    history,
    token,
    userId,
    name,
    onUpdateUserCredentials,
    onSignout,
    entries,
    setEntries,
  } = props;

  const imageRef = useRef();

  const [detected, setDetected] = useState(false);
  const [clarifaiLoading, setClarifaiLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [faceBoxes, setFaceBoxes] = useState(null);

  useEffect(() => {
    if (!signedIn) {
      history.push('/signin');
    }
  }, [signedIn, history]);

  const inputChangeHandler = useCallback(e => {
    setImageUrl(e.target.value);
  }, []);

  const parseFaceBoxes = useCallback(regions => {
    return regions.map(region => {
      const {
        top_row,
        bottom_row,
        left_col,
        right_col,
      } = region.region_info.bounding_box;
      return {
        id: region.id,
        top: top_row * 100,
        left: left_col * 100,
        right: (1 - right_col) * 100,
        bottom: (1 - bottom_row) * 100,
      };
    });
  }, []);

  const detectClickHandler = useCallback(async () => {
    try {
      imageRef.current.src = '';
      imageRef.current.src = imageUrl;
      setFaceBoxes(null);
      setDetected(true);
      setImageLoading(true);
      setClarifaiLoading(true);
      let res = await clarifai.models.predict(
        Clarifai.FACE_DETECT_MODEL,
        imageUrl
      );

      setFaceBoxes(parseFaceBoxes(res.outputs[0].data.regions));

      res = await fetch('http://localhost:8080/api/user/image', {
        method: 'PUT',
        body: JSON.stringify({
          id: userId,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if ((data.message = 'Successfully updated user entries')) {
        if (data.token) {
          onUpdateUserCredentials(data);
        }
      } else {
        onSignout();
      }

      setEntries(data.user.entries);

      setClarifaiLoading(false);
    } catch (err) {
      setClarifaiLoading(false);
      console.log(err);
    }
  }, [
    imageUrl,
    parseFaceBoxes,
    onUpdateUserCredentials,
    token,
    userId,
    setEntries,
    onSignout,
  ]);

  const imageLoadHandler = useCallback(() => {
    setImageLoading(false);
  }, []);

  return (
    <Fragment>
      <Logo />
      <Entries name={name} entries={entries} />
      <ImageLinkForm
        imageUrl={imageUrl}
        onInputChange={inputChangeHandler}
        onDetectClick={detectClickHandler}
      />
      <FaceRecognition
        imageRef={imageRef}
        faceBoxes={faceBoxes}
        detected={detected}
        loading={imageLoading || clarifaiLoading}
        onImageLoad={imageLoadHandler}
      />
    </Fragment>
  );
};

export default Main;
