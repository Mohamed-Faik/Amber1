"use client";
import React, { useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import { getTranslation } from "@/utils/translations";
import { useLanguage } from "@/contexts/LanguageContext";

const FilterPopup = ({ isOpen, onClose, onApply, featureType = "HOMES", listings = [] }) => {
    const { language, isDetecting } = useLanguage();
    const displayLanguage = isDetecting ? "en" : language;

    // Get currency symbol based on language
    const getCurrencySymbol = () => {
        switch (displayLanguage) {
            case 'fr':  // French → Euro
                return '€';
            case 'nl':  // Belgian/Dutch → Euro
                return '€';
            case 'en':  // English → Pound
                return '£';
            default:
                return '$';
        }
    };

    const currencySymbol = getCurrencySymbol();

    // Calculate price range from listings
    const calculatePriceRange = () => {
        if (!listings || listings.length === 0) {
            return { min: 0, max: 1000 };
        }
        const prices = listings.map(listing => listing.price || 0).filter(p => p > 0);
        if (prices.length === 0) {
            return { min: 0, max: 1000 };
        }
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        return { min: Math.floor(minPrice), max: Math.ceil(maxPrice) };
    };

    const initialRange = calculatePriceRange();

    // Common State
    const [priceRange, setPriceRange] = useState(initialRange);
    const [selectedMin, setSelectedMin] = useState(initialRange.min);
    const [selectedMax, setSelectedMax] = useState(initialRange.max);

    // Homes State
    const [beds, setBeds] = useState(0);
    const [baths, setBaths] = useState(0);
    const [propertyType, setPropertyType] = useState([]);
    const [amenities, setAmenities] = useState([]);

    // Experiences State
    const [duration, setDuration] = useState([]);
    const [groupSize, setGroupSize] = useState("Any");
    const [activityType, setActivityType] = useState([]);

    if (!isOpen) return null;

    const handleCheckboxChange = (value, state, setState) => {
        if (state.includes(value)) {
            setState(state.filter(item => item !== value));
        } else {
            setState([...state, value]);
        }
    };

    const Counter = ({ label, value, setValue }) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <span style={{ fontSize: "16px", color: "#222" }}>{label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <button
                    onClick={() => setValue(Math.max(0, value - 1))}
                    disabled={value === 0}
                    style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        border: value === 0 ? "1px solid #B0B0B0" : "1px solid #FF385C",
                        display: "flex", alignItems: "center", justifyContent: "center", background: "white",
                        cursor: value === 0 ? "not-allowed" : "pointer",
                        opacity: value === 0 ? 0.3 : 1,
                        transition: "all 0.2s ease"
                    }}
                >
                    <Minus size={16} color={value === 0 ? "#717171" : "#FF385C"} />
                </button>
                <span style={{ fontSize: "16px", minWidth: "20px", textAlign: "center" }}>{value === 0 ? "Any" : value + "+"}</span>
                <button
                    onClick={() => setValue(value + 1)}
                    style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        border: "1px solid #FF385C",
                        display: "flex", alignItems: "center", justifyContent: "center", background: "white",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                    }}
                >
                    <Plus size={16} color="#FF385C" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="filter-backdrop" style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 2000,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px", opacity: isOpen ? 1 : 0, transition: "opacity 0.3s ease",
        }} onClick={onClose}>
            <div className="filter-modal" style={{
                backgroundColor: "#fff", width: "100%", maxWidth: "780px", height: "auto", maxHeight: "85vh",
                borderRadius: "12px", display: "flex", flexDirection: "column", position: "relative",
                boxShadow: "0 8px 28px rgba(0,0,0,0.28)", animation: "slideUp 0.3s ease-out",
            }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{ padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #EBEBEB" }}>
                    <button onClick={onClose} className="hover-bg" style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", marginLeft: "-8px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <X size={18} />
                    </button>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", margin: 0, flex: 1, textAlign: "center" }}>
                        {getTranslation(displayLanguage, "Filters") || "Filters"}
                    </h3>
                    <div style={{ width: "32px" }}></div>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>

                    {/* Price Range (Common) */}
                    <section style={{ marginBottom: "32px" }}>
                        <h4 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "8px" }}>
                            {getTranslation(displayLanguage, "Price range") || "Price range"}
                        </h4>
                        <p style={{ color: "#717171", fontSize: "14px", marginBottom: "24px" }}>
                            {getTranslation(displayLanguage, "Nightly prices before fees and taxes") || "Nightly prices before fees and taxes"} ({currencySymbol})
                        </p>

                        <div style={{ padding: "0 16px", marginBottom: "40px" }}>
                            {/* Histogram + Slider */}
                            <div style={{ position: "relative", marginBottom: "48px" }}>
                                {/* Histogram bars */}
                                <div style={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    height: "64px",
                                    gap: "3px",
                                    paddingLeft: "16px",
                                    paddingRight: "16px"
                                }}>
                                    {[12, 24, 18, 28, 40, 20, 32, 48, 60, 38, 28, 56, 72, 44, 32, 24, 36, 28, 20, 14, 10, 24, 36, 56, 28, 20, 10, 6, 14, 24, 32, 20, 10, 6, 10, 14, 20, 10, 6, 10].map((height, index, arr) => {
                                        const percent = index / arr.length;
                                        const priceAtBar = priceRange.min + (percent * (priceRange.max - priceRange.min));
                                        const isActive = priceAtBar >= selectedMin && priceAtBar <= selectedMax;
                                        return (
                                            <div
                                                key={index}
                                                style={{
                                                    flex: 1,
                                                    height: `${height}%`,
                                                    backgroundColor: isActive ? "#FF385C" : "#DDDDDD",
                                                    borderRadius: "2px 2px 0 0",
                                                    transition: "background-color 0.2s ease"
                                                }}
                                            />
                                        );
                                    })}
                                </div>

                                {/* Slider - positioned right at the base of histogram */}
                                <div style={{
                                    position: "relative",
                                    marginTop: "-2px"
                                }}>
                                    {/* Track line */}
                                    <div style={{
                                        position: "relative",
                                        height: "4px",
                                        margin: "0 16px"
                                    }}>
                                        <div style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: 0,
                                            right: 0,
                                            height: "1px",
                                            backgroundColor: "#DDDDDD",
                                            transform: "translateY(-50%)"
                                        }}></div>

                                        {/* Range Inputs */}
                                        <input
                                            type="range"
                                            min={priceRange.min}
                                            max={priceRange.max}
                                            value={selectedMin}
                                            onChange={(e) => {
                                                const value = Math.min(Number(e.target.value), selectedMax - 10);
                                                setSelectedMin(value);
                                            }}
                                            style={{
                                                position: "absolute",
                                                top: "50%",
                                                left: 0,
                                                width: "100%",
                                                height: "1px",
                                                appearance: "none",
                                                background: "transparent",
                                                pointerEvents: "none",
                                                transform: "translateY(-50%)",
                                                zIndex: selectedMin > (priceRange.min + priceRange.max) / 2 ? 5 : 3
                                            }}
                                            className="range-slider"
                                        />
                                        <input
                                            type="range"
                                            min={priceRange.min}
                                            max={priceRange.max}
                                            value={selectedMax}
                                            onChange={(e) => {
                                                const value = Math.max(Number(e.target.value), selectedMin + 10);
                                                setSelectedMax(value);
                                            }}
                                            style={{
                                                position: "absolute",
                                                top: "50%",
                                                left: 0,
                                                width: "100%",
                                                height: "1px",
                                                appearance: "none",
                                                background: "transparent",
                                                pointerEvents: "none",
                                                transform: "translateY(-50%)",
                                                zIndex: 4
                                            }}
                                            className="range-slider"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Price Input Fields */}
                            <div style={{ display: "flex", gap: "16px", justifyContent: "space-between" }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{
                                        fontSize: "12px",
                                        color: "#717171",
                                        display: "block",
                                        marginBottom: "8px",
                                        fontWeight: "400"
                                    }}>
                                        Minimum
                                    </label>
                                    <div style={{
                                        border: "1px solid #B0B0B0",
                                        borderRadius: "32px",
                                        padding: "16px 24px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#FFFFFF"
                                    }}>
                                        <span style={{
                                            fontSize: "16px",
                                            fontWeight: "400",
                                            color: "#717171",
                                            marginRight: "4px"
                                        }}>{currencySymbol}</span>
                                        <input
                                            type="number"
                                            value={selectedMin}
                                            onChange={(e) => setSelectedMin(Number(e.target.value))}
                                            style={{
                                                border: "none",
                                                outline: "none",
                                                width: "100%",
                                                fontSize: "16px",
                                                fontWeight: "400",
                                                color: "#222",
                                                backgroundColor: "transparent",
                                                textAlign: "center"
                                            }}
                                        />
                                    </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{
                                        fontSize: "12px",
                                        color: "#717171",
                                        display: "block",
                                        marginBottom: "8px",
                                        fontWeight: "400"
                                    }}>
                                        Maximum
                                    </label>
                                    <div style={{
                                        border: "1px solid #B0B0B0",
                                        borderRadius: "32px",
                                        padding: "16px 24px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#FFFFFF"
                                    }}>
                                        <span style={{
                                            fontSize: "16px",
                                            fontWeight: "400",
                                            color: "#717171",
                                            marginRight: "4px"
                                        }}>{currencySymbol}</span>
                                        <input
                                            type="number"
                                            value={selectedMax}
                                            onChange={(e) => setSelectedMax(Number(e.target.value))}
                                            style={{
                                                border: "none",
                                                outline: "none",
                                                width: "100%",
                                                fontSize: "16px",
                                                fontWeight: "400",
                                                color: "#222",
                                                backgroundColor: "transparent",
                                                textAlign: "center"
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="divider" />

                    {featureType === "HOMES" && (
                        <>
                            {/* Rooms and Beds */}
                            <section style={{ marginBottom: "32px" }}>
                                <h4 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "24px" }}>
                                    {getTranslation(displayLanguage, "Rooms and beds") || "Rooms and beds"}
                                </h4>
                                <Counter label={getTranslation(displayLanguage, "Bedrooms") || "Bedrooms"} value={beds} setValue={setBeds} />
                                <Counter label={getTranslation(displayLanguage, "Bathrooms") || "Bathrooms"} value={baths} setValue={setBaths} />
                            </section>
                        </>
                    )}

                    {featureType === "EXPERIENCES" && (
                        <>
                            {/* Duration */}
                            <section style={{ marginBottom: "32px" }}>
                                <h4 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "24px" }}>
                                    {getTranslation(displayLanguage, "Duration") || "Duration"}
                                </h4>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                                    {["Up to 1 hour", "1-4 hours", "Full day", "Multi-day"].map((d) => (
                                        <button
                                            key={d}
                                            onClick={() => handleCheckboxChange(d, duration, setDuration)}
                                            style={{
                                                padding: "8px 20px", borderRadius: "30px", border: `1px solid ${duration.includes(d) ? "#222" : "#EBEBEB"}`,
                                                backgroundColor: duration.includes(d) ? "#222" : "white", color: duration.includes(d) ? "white" : "#222",
                                                fontSize: "14px", cursor: "pointer", transition: "all 0.2s"
                                            }}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <div className="divider" />

                            {/* Activity Type */}
                            <section style={{ marginBottom: "32px" }}>
                                <h4 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "24px" }}>
                                    {getTranslation(displayLanguage, "Activity Type") || "Activity Type"}
                                </h4>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                    {["Art & Culture", "Food & Drink", "Sports", "Nature", "Entertainment", "Wellness"].map((type) => (
                                        <label key={type} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                                            <input
                                                type="checkbox"
                                                className="airbnb-checkbox"
                                                checked={activityType.includes(type)}
                                                onChange={() => handleCheckboxChange(type, activityType, setActivityType)}
                                                style={{ width: "18px", height: "18px" }}
                                            />
                                            <span style={{ fontSize: "16px", color: "#222" }}>{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <div className="divider" />

                            {/* Group Size */}
                            <section>
                                <h4 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "24px" }}>
                                    {getTranslation(displayLanguage, "Group Size") || "Group Size"}
                                </h4>
                                <div style={{ display: "flex", gap: "16px" }}>
                                    {["Any", "Small (1-5)", "Medium (6-15)", "Large (15+)"].map((size) => (
                                        <label key={size} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                            <input
                                                type="radio"
                                                name="groupSize"
                                                checked={groupSize === size}
                                                onChange={() => setGroupSize(size)}
                                                className="airbnb-checkbox"
                                                style={{ width: "18px", height: "18px" }}
                                            />
                                            <span style={{ fontSize: "16px", color: "#222" }}>{size}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div style={{ padding: "16px 24px", borderTop: "1px solid #EBEBEB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <button
                        onClick={() => {
                            setSelectedMin(initialRange.min);
                            setSelectedMax(initialRange.max);
                            setBeds(0); setBaths(0); setPropertyType([]); setAmenities([]);
                            setDuration([]); setActivityType([]); setGroupSize("Any");
                        }}
                        style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "600", textDecoration: "underline", cursor: "pointer", color: "#222" }}
                    >
                        {getTranslation(displayLanguage, "Clear all") || "Clear all"}
                    </button>
                    <button onClick={onClose} className="airbnb-btn" style={{ color: "#fff", border: "none", borderRadius: "8px", padding: "14px 24px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>
                        {getTranslation(displayLanguage, "Show results") || "Show results"}
                    </button>
                </div>
            </div>

            <style jsx>{`
				@keyframes slideUp {
					from { transform: translateY(100%); opacity: 0; }
					to { transform: translateY(0); opacity: 1; }
				}
				.hover-bg:hover {
					background-color: #f7f7f7 !important;
				}
				.airbnb-btn {
					background-color: #FF385C;
					transition: background-color 0.2s ease;
				}
				.airbnb-btn:hover {
					background-color: #D90B3E;
				}
				.airbnb-checkbox {
					accent-color: #FF385C;
				}
				.divider {
					height: 1px;
					background-color: #EBEBEB;
					margin: 0 -24px 32px -24px;
				}
                .range-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #FFFFFF;
                    border: 1px solid #B0B0B0;
                    cursor: pointer;
                    pointer-events: auto;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    margin-top: -14px;
                }
                .range-slider::-moz-range-thumb {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #FFFFFF;
                    border: 1px solid #B0B0B0;
                    cursor: pointer;
                    pointer-events: auto;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .range-slider::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                    border-color: #222;
                }
			`}</style>
        </div>
    );
};

export default FilterPopup;
