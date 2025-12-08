"use client";

import React, { useEffect, useMemo, useCallback } from "react";
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
	const prevCenterRef = React.useRef(null);
	
	useEffect(() => {
		// Ensure map is initialized
		if (!map || !map.getCenter) return;
		
		// Validate center exists and is valid array
		if (!center || !Array.isArray(center) || center.length !== 2) return;
		
		// Skip if center hasn't changed
		if (prevCenterRef.current && 
			prevCenterRef.current[0] === center[0] && 
			prevCenterRef.current[1] === center[1]) {
			return;
		}
		
		const [lat, lng] = center;
		// Validate coordinates are valid numbers within valid ranges
		if (typeof lat === 'number' && typeof lng === 'number' && 
			!isNaN(lat) && !isNaN(lng) && 
			isFinite(lat) && isFinite(lng) &&
			lat >= -90 && lat <= 90 &&
			lng >= -180 && lng <= 180) {
			try {
				// Double-check the center array is valid before calling flyTo
				const validCenter = [Number(lat), Number(lng)];
				if (!isNaN(validCenter[0]) && !isNaN(validCenter[1]) &&
					isFinite(validCenter[0]) && isFinite(validCenter[1])) {
					prevCenterRef.current = validCenter;
					map.flyTo(validCenter, 13, {
						animate: true,
						duration: 1.5
					});
				}
			} catch (error) {
				console.warn('Error flying to center:', error, 'Center was:', center);
			}
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
	
	// Helper function to validate and parse coordinates
	const getValidCenter = useCallback((position) => {
		if (!position) return defaultCenter;
		
		// Try to parse as numbers if they're strings
		const lat = typeof position.lat === 'number' ? position.lat : parseFloat(position.lat);
		const lng = typeof position.lng === 'number' ? position.lng : parseFloat(position.lng);
		
		// Validate coordinates are valid numbers
		if (typeof lat === 'number' && typeof lng === 'number' && 
			!isNaN(lat) && !isNaN(lng) &&
			isFinite(lat) && isFinite(lng) &&
			lat >= -90 && lat <= 90 && // Valid latitude range
			lng >= -180 && lng <= 180) { // Valid longitude range
			return [lat, lng];
		}
		
		return defaultCenter;
	}, []);
	
	// Memoize center to prevent unnecessary recalculations
	const center = useMemo(() => {
		const calculated = getValidCenter(markerPosition);
		// Final safety check - ensure the result is always valid
		if (Array.isArray(calculated) && calculated.length === 2) {
			const [lat, lng] = calculated;
			if (typeof lat === 'number' && typeof lng === 'number' && 
				!isNaN(lat) && !isNaN(lng) && 
				isFinite(lat) && isFinite(lng)) {
				// Create a new array to avoid mutation issues
				return [Number(lat), Number(lng)];
			}
		}
		// Always return a new array reference for defaultCenter
		return [...defaultCenter];
	}, [markerPosition, getValidCenter]);

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
