"use client";

import React, { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";

let L;
if (typeof window !== "undefined") {
	L = require("leaflet");
	
	// Fix for default marker icons
	try {
		delete L.Icon.Default.prototype._getIconUrl;
		const markerIcon = require("leaflet/dist/images/marker-icon.png");
		const markerIcon2x = require("leaflet/dist/images/marker-icon-2x.png");
		const markerShadow = require("leaflet/dist/images/marker-shadow.png");
		
		L.Icon.Default.mergeOptions({
			iconUrl: markerIcon.default || markerIcon,
			iconRetinaUrl: markerIcon2x.default || markerIcon2x,
			shadowUrl: markerShadow.default || markerShadow,
		});
	} catch (e) {
		// Icon setup failed, will use custom marker instead
	}
}

// Component to handle map clicks
function MapClickHandler({ onMapClick }) {
	useMapEvents({
		click: (e) => {
			onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
		},
	});
	return null;
}

// Component to update map view when marker position changes
function ChangeMapView({ center, zoom }) {
	const map = useMap();
	const prevCenterRef = useRef(null);
	
	useEffect(() => {
		if (center && Array.isArray(center) && center.length === 2) {
			const [lat, lng] = center;
			if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
				// Check if center actually changed
				const currentCenter = `${lat}-${lng}`;
				if (prevCenterRef.current !== currentCenter) {
					prevCenterRef.current = currentCenter;
					map.setView([lat, lng], zoom || 13, {
						animate: true,
						duration: 0.8
					});
				}
			}
		}
	}, [center?.[0], center?.[1], zoom, map]);
	return null;
}

// Component to handle marker drag
function DraggableMarker({ position, onDragEnd }) {
	const [markerPosition, setMarkerPosition] = useState([position.lat, position.lng]);

	useEffect(() => {
		setMarkerPosition([position.lat, position.lng]);
	}, [position]);

	const createGreenMarkerIcon = () => {
		if (!L) return null;
		
		return L.divIcon({
			className: "custom-marker",
			html: `
				<div style="
					width: 40px;
					height: 40px;
					background-color: #FF385C;
					border-radius: 50%;
					border: 3px solid #FFFFFF;
					box-shadow: 0 2px 8px rgba(0,0,0,0.3);
					display: flex;
					align-items: center;
					justify-content: center;
					color: #FFFFFF;
					font-weight: 600;
					font-size: 18px;
					cursor: move;
				">K</div>
			`,
			iconSize: [40, 40],
			iconAnchor: [20, 40],
		});
	};

	return (
		<Marker
			position={markerPosition}
			draggable={true}
			icon={createGreenMarkerIcon()}
			eventHandlers={{
				dragend: (e) => {
					const newPosition = e.target.getLatLng();
					onDragEnd({ lat: newPosition.lat, lng: newPosition.lng });
				},
			}}
		/>
	);
}

const LocationMap = ({ markerPosition, onMarkerDragEnd, onMapClick }) => {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient || typeof window === "undefined") {
		return (
			<div
				style={{
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					color: "#717171",
				}}
			>
				Loading map...
			</div>
		);
	}

	const mapCenter = [markerPosition.lat, markerPosition.lng];

	return (
		<div style={{ position: "relative", height: "100%", width: "100%" }}>
			<MapContainer
				center={mapCenter}
				zoom={13}
				style={{ height: "100%", width: "100%", zIndex: 1 }}
				scrollWheelZoom={true}
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				/>
				<ChangeMapView center={mapCenter} zoom={13} />
				<MapClickHandler onMapClick={onMapClick} />
				<DraggableMarker
					position={markerPosition}
					onDragEnd={onMarkerDragEnd}
				/>
			</MapContainer>

			{/* Instruction Tooltip */}
			<div
				style={{
					position: "absolute",
					top: "20px",
					left: "50%",
					transform: "translateX(-50%)",
					backgroundColor: "#FF385C",
					color: "#FFFFFF",
					padding: "12px 24px",
					borderRadius: "8px",
					fontSize: "14px",
					fontWeight: "500",
					boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
					zIndex: 1000,
					maxWidth: "90%",
					textAlign: "center",
					pointerEvents: "none",
				}}
			>
				Move the map for more precision and click on 'Next'
			</div>
		</div>
	);
};

export default LocationMap;

