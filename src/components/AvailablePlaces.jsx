import {  useCallback } from 'react';

import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';
import { useFetch } from '../hooks/useFetch.js';

export default function AvailablePlaces({ onSelectPlace }) {


const fetchSortedPlaces = useCallback(async function fetchSortedPlaces(){
  const places = await fetchAvailablePlaces();
  
  return new Promise((res, rej) =>{
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const sortedPlaces = sortPlacesByDistance(
          places,
          position.coords.latitude,
          position.coords.longitude
        );
       res(sortedPlaces)
      },
      () => {
        const KYIV_COORDS = { latitude: 50.4501, longitude: 30.5234 }; 
        const sortedPlaces = sortPlacesByDistance(
          places,
          KYIV_COORDS.latitude,
          KYIV_COORDS.longitude
        );
        res(sortedPlaces)
  
      }
    );
  })
  
  }, []) 

  const {isFetching, error, fetchedData: availablePlaces} = useFetch(fetchSortedPlaces, [])

  if (error) {
    return <Error title="An error occurred!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
