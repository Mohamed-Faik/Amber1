"use client";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Delete the _getIconUrl function from L.Icon.Default.prototype
// delete L.Icon.Default.prototype._getIconUrl;

// Merge the options for the default icon with custom URLs
L.Icon.Default.mergeOptions({
	iconUrl: markerIcon.src,
	iconRetinaUrl: markerIcon2x.src,
	shadowUrl: markerShadow.src,
});

export function ChangeView({ coords }) {
	const map = useMap();
	map.setView(coords, 12);
	return null;
}

const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution =
	'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export default function Map({ latitude, longitude }) {
	const [geoData, setGeoData] = useState({ lat: 64.536634, lng: 16.779852 });
	const center = [geoData.lat, geoData.lng];

	useEffect(() => {
		setGeoData({ lat: latitude, lng: longitude });
	}, [latitude, longitude]);
	return (
		<div className="location-content">
			<h3>Location</h3>
			<MapContainer
				center={[51, -0.09]}
				zoom={center ? 4 : 2}
				style={{ height: "50vh" }}
				scrollWheelZoom={false}
			>
				<TileLayer url={url} attribution={attribution} />
				{geoData.lat && geoData.lng && (
					<Marker position={[geoData.lat, geoData.lng]} />
				)}
				<ChangeView coords={center} />
			</MapContainer>
		</div>
	);
}
