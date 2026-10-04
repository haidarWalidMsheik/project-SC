import { useEffect, useMemo, useState } from 'react';
import L from 'leaflet';
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet';
import { CLINIC_LOCATION } from '../config/clinic';
import { formatDistance, getDistanceInKm } from '../utils/distance';

const clinicPosition = [CLINIC_LOCATION.latitude, CLINIC_LOCATION.longitude];

const clinicMarker = L.divIcon({
  className: 'clinic-pin-wrap',
  html: '<span class="clinic-pin" aria-hidden="true">✦</span>',
  iconSize: [42, 42],
  iconAnchor: [21, 38],
  popupAnchor: [0, -40],
});

function MapViewport({ userLocation }) {
  const map = useMap();

  useEffect(() => {
    if (!userLocation) return;

    const bounds = L.latLngBounds([clinicPosition, [userLocation.latitude, userLocation.longitude]]);
    map.fitBounds(bounds, { padding: [56, 56], maxZoom: 14 });
  }, [map, userLocation]);

  return null;
}

export default function ClinicMap() {
  const [userLocation, setUserLocation] = useState(null);
  const [locationState, setLocationState] = useState('idle');
  const [locationError, setLocationError] = useState('');

  const distance = useMemo(() => {
    if (!userLocation) return null;
    return getDistanceInKm(userLocation, CLINIC_LOCATION);
  }, [userLocation]);

  function getMyLocation() {
    if (!navigator.geolocation) {
      setLocationError('This browser does not support location services.');
      setLocationState('error');
      return;
    }

    setLocationState('loading');
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({ latitude: coords.latitude, longitude: coords.longitude });
        setLocationState('success');
      },
      (error) => {
        const messages = {
          1: 'Location permission was declined. Allow it in your browser to see your distance.',
          2: 'Your location could not be determined. Please try again.',
          3: 'Location request timed out. Please try again.',
        };
        setLocationError(messages[error.code] ?? 'We could not get your location. Please try again.');
        setLocationState('error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }

  function getDirections() {
    if (!navigator.geolocation) {
      setLocationError('This browser does not support location services.');
      setLocationState('error');
      return;
    }

    setLocationState('loading');
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const visitor = { latitude: coords.latitude, longitude: coords.longitude };
        setUserLocation(visitor);
        setLocationState('success');
        const routeUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${visitor.latitude}%2C${visitor.longitude}%3B${CLINIC_LOCATION.latitude}%2C${CLINIC_LOCATION.longitude}`;
        window.open(routeUrl, '_blank', 'noopener,noreferrer');
      },
      (error) => {
        const messages = {
          1: 'Location permission was declined. Allow it in your browser to get directions.',
          2: 'Your location could not be determined. Please try again.',
          3: 'Location request timed out. Please try again.',
        };
        setLocationError(messages[error.code] ?? 'We could not get your location. Please try again.');
        setLocationState('error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }

  return (
    <div className="location-map-card">
      <MapContainer
        center={clinicPosition}
        zoom={14}
        scrollWheelZoom={false}
        className="clinic-map"
        aria-label="Interactive map showing Smiley Land Clinic"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={clinicPosition} icon={clinicMarker}>
          <Popup>
            <strong>{CLINIC_LOCATION.name}</strong>
            <br />
            {CLINIC_LOCATION.address}
            <br />
            <a href={CLINIC_LOCATION.mapLink} target="_blank" rel="noreferrer">Open the exact clinic location ↗</a>
          </Popup>
        </Marker>
        {userLocation && (
          <>
            <Polyline
              positions={[clinicPosition, [userLocation.latitude, userLocation.longitude]]}
              pathOptions={{ color: '#e97f59', dashArray: '8 10', weight: 3 }}
            />
            <CircleMarker
              center={[userLocation.latitude, userLocation.longitude]}
              radius={10}
              pathOptions={{ color: '#ffffff', weight: 3, fillColor: '#1daac0', fillOpacity: 1 }}
            >
              <Tooltip direction="top" offset={[0, -12]} opacity={1} permanent>
                Your location
              </Tooltip>
            </CircleMarker>
          </>
        )}
        <MapViewport userLocation={userLocation} />
      </MapContainer>

      <div className="map-actions" aria-live="polite">
        <button className="location-button" type="button" onClick={getMyLocation} disabled={locationState === 'loading'}>
          <span aria-hidden="true">⌖</span>
          {locationState === 'loading' ? 'Finding your location…' : 'Get my location'}
        </button>
        <button className="directions-button" type="button" onClick={getDirections} disabled={locationState === 'loading'}>
          Get directions in OpenStreetMap <span aria-hidden="true">↗</span>
        </button>
        <a className="directions-button clinic-location-link" href={CLINIC_LOCATION.mapLink} target="_blank" rel="noreferrer">
          Open clinic pin <span aria-hidden="true">↗</span>
        </a>
        {distance !== null && (
          <p className="distance-message">
            You are <strong>{formatDistance(distance)}</strong> from the clinic, as the crow flies.
          </p>
        )}
        {locationError && <p className="location-error">{locationError}</p>}
      </div>
    </div>
  );
}
