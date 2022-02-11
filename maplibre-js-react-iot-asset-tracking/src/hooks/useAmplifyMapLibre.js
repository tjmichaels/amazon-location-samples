import { useRef, useState, useEffect } from 'react';
import { Auth, Geo } from 'aws-amplify';
import { AmplifyMapLibreRequest } from 'maplibre-gl-js-amplify';

const useAmplifyMapLibre = (credentials, mapRegion) => {
  const [transformerReady, setTransformerReady] = useState(false);
  const amplifyMaplibre = useRef();

  useEffect(() => {
    const createTransformer = async () => {
      if (!transformerReady) {
        // create a new AmplifyMapLibreRequest instance and save it in a ref
        // so it persists re-renders and takes care of renewing the AWS credentials
        amplifyMaplibre.current = new AmplifyMapLibreRequest(
          // If no AWS credentials are passed to the React hook, fetch them from Amazon Cognito using Amplify Auth
          (credentials || await Auth.currentCredentials()),
          // If no AWS region for the map is passed to the React hook, use the region of the default map specified in `aws-exports.js`
          (mapRegion || (Geo.getDefaultMap()).region),
        );
        // Set the transformerReady state to true to re-render the component
        setTransformerReady(true);
      }
    };

    createTransformer();
  }, [transformerReady, mapRegion, credentials]);

  return amplifyMaplibre.current;
};

export default useAmplifyMapLibre;