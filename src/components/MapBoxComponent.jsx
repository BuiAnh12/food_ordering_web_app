import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapBoxComponent = ({ currentLatitude, currentLongitude, onLocationSelect }) => {
  const mapContainerRef = useRef();
  const mapRef = useRef();
  const markerRef = useRef();

  useEffect(() => {
    // Initialize the Mapbox map
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESSTOKEN;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [currentLongitude || -74.5, currentLatitude || 40], // Default to a location if no coordinates
      zoom: 9,
    });

    // Add a marker to the map
    markerRef.current = new mapboxgl.Marker()
      .setLngLat([currentLongitude || -74.5, currentLatitude || 40])
      .addTo(mapRef.current);

    // Set up a click event to update the marker's position and send the coordinates to the parent
    mapRef.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      markerRef.current.setLngLat([lng, lat]);
      onLocationSelect(lat, lng); // Send the selected position to the parent
    });

    // Clean up on component unmount
    return () => {
      mapRef.current.remove();
    };
  }, [currentLatitude, currentLongitude, onLocationSelect]);

  return <div style={{ height: '400px' }} ref={mapContainerRef} className="map-container" />;
};

export default MapBoxComponent;
