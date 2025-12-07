"use client";

import React, { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to update map center when coordinates change
const MapUpdater = ({ center }) => {
	const map = useMap();
	useEffect(() => {
		if (center) {
			map.flyTo(center, 13, {
				animate: true,
				duration: 1.5
			});
		}
	}, [center, map]);
	return null;
};

// Component to handle map clicks
const MapClickHandler = ({ onMapClick }) => {
	useMapEvents({
		click: (e) => {
			if (onMapClick) {
				onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
			}
		},
	});
	return null;
};

// Draggable Marker Component
const DraggableMarker = ({ position, onDragEnd }) => {
	const markerRef = React.useRef(null);

	const eventHandlers = useMemo(
		() => ({
			dragend() {
				const marker = markerRef.current;
				if (marker != null) {
					const newPos = marker.getLatLng();
					if (onDragEnd) {
						onDragEnd({ lat: newPos.lat, lng: newPos.lng });
					}
				}
			},
		}),
		[onDragEnd]
	);

	return (
		<Marker
			draggable={true}
			eventHandlers={eventHandlers}
			position={position}
			ref={markerRef}
		>
			<Popup>Selected Location</Popup>
		</Marker>
	);
};

const LocationMap = ({ markerPosition, onMarkerDragEnd, onMapClick }) => {
	// Default to Marrakech if no position provided
	const defaultCenter = [31.6295, -7.9811];
	const center = markerPosition ? [markerPosition.lat, markerPosition.lng] : defaultCenter;

	return (
		<div style={{ height: "100%", width: "100%", position: "relative" }}>
			<MapContainer
				center={center}
				zoom={13}
				scrollWheelZoom={true}
				style={{ height: "100%", width: "100%" }}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<DraggableMarker
					position={center}
					onDragEnd={onMarkerDragEnd}
				/>
				<MapUpdater center={center} />
				<MapClickHandler onMapClick={onMapClick} />
			</MapContainer>
		</div>
	);
};

export default LocationMap;
