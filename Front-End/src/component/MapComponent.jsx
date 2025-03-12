import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";

const sourceIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
 
const destinationIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
 
const MapComponent = ({ setSource, setDestination }) => {
  const [positions, setPositions] = useState({ source: null, destination: null });
  const [route, setRoute] = useState([]);
  const [selecting, setSelecting] = useState("source");
 

  const fetchRoute = async (source, destination) => {
    if (!source || !destination) return;
 
    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${source[1]},${source[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`
      );
 
      if (response.data.routes.length > 0) {
        const routeCoordinates = response.data.routes[0].geometry.coordinates.map((coord) => [coord[1], coord[0]]);
        setRoute(routeCoordinates);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };
 
  
  const LocationMarker = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        let updatedPositions = { ...positions };
 
      
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const address = response.data.address;
          const formattedAddress = `${address.road || "Unknown Road"}, ${address.city || address.town || address.state}`;
 
          if (selecting === "source") {
            updatedPositions.source = [lat, lng];
            setSource(formattedAddress);
          } else {
            updatedPositions.destination = [lat, lng];
            setDestination(formattedAddress);
          }
 
          setPositions(updatedPositions);
          setSelecting(selecting === "source" ? "destination" : "source");
 
         
          if (updatedPositions.source && updatedPositions.destination) {
            fetchRoute(updatedPositions.source, updatedPositions.destination);
          }
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      },
    });
 
    return (
      <>
        {positions.source && <Marker position={positions.source} icon={sourceIcon} />}
        {positions.destination && <Marker position={positions.destination} icon={destinationIcon} />}
      </>
    );
  };
 
  return (
    <div className="w-full h-96">
      <MapContainer center={[12.9716, 77.5946]} zoom={13} className="w-full h-full rounded-lg">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker />
 
        {/* Draw Route Line */}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
};
 
export default MapComponent;