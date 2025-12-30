"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    SlidersHorizontal,
    X,
    Minus,
    Plus,
    Wifi,
    Tv,
    Wind,
    Thermometer,
    Utensils,
    Car,
    Waves,
    Trees,
    Shield,
    ArrowUpFromLine,
    Flower,
    Warehouse,
    ArrowDownToLine,
    Sun,
    Building2,
    Castle,
    HomeIcon,
    MapPin
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/utils/translations";
import { moroccanCities } from "@/libs/moroccanCities";

// Map amenities to icons
const amenityConfig = [
    { id: "gatedCommunity", label: "Gated Community", icon: Shield },
    { id: "elevator", label: "Elevator", icon: ArrowUpFromLine },
    { id: "securitySystem", label: "Security System", icon: Shield },
    { id: "heating", label: "Heating", icon: Thermometer },
    { id: "airConditioning", label: "Air Conditioning", icon: Wind },
    { id: "equippedKitchen", label: "Equipped Kitchen", icon: Utensils },
    { id: "balcony", label: "Balcony", icon: Sun },
    { id: "terrace", label: "Terrace", icon: Sun },
    { id: "privateGarden", label: "Private Garden", icon: Flower },
    { id: "swimmingPool", label: "Swimming Pool", icon: Waves },
    { id: "greenSpaces", label: "Green Spaces", icon: Trees },
    { id: "garageBox", label: "Garage Box", icon: Warehouse },
    { id: "parkingSpaces", label: "Parking Spaces", icon: Car },
    { id: "basement", label: "Basement", icon: ArrowDownToLine },
];

// Property categories (matching add listing page)
const propertyCategories = [
    { value: "Apartment", label: "Apartment", icon: Building2 },
    { value: "Villa", label: "Villa", icon: Castle },
    { value: "Land", label: "Land", icon: Trees },
    { value: "Commercial", label: "Commercial", icon: Building2 },
    { value: "Riad", label: "Riad", icon: Castle },
    { value: "House", label: "House", icon: HomeIcon },
];

const ListingFilters = ({ searchParams, availableAmenities = null }) => {
    const router = useRouter();
    const { language } = useLanguage();
    const isRTL = language === 'ar';

    const [showModal, setShowModal] = useState(false);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [propertyCount, setPropertyCount] = useState(null);
    const [isCountLoading, setIsCountLoading] = useState(false);

    // Filter States
    const [priceRange, setPriceRange] = useState([0, 5000]); // [min, max] - Updated default range
    const [bedrooms, setBedrooms] = useState(0); // 0 = Any
    const [beds, setBeds] = useState(0); // 0 = Any
    const [bathrooms, setBathrooms] = useState(0); // 0 = Any
    const [selectedAmenities, setSelectedAmenities] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(""); // Property type filter
    const [selectedLocation, setSelectedLocation] = useState(""); // Location filter

    // Use dynamic amenities if provided, otherwise fall back to default config
    const activeAmenities = availableAmenities || amenityConfig;

    // Initialize from URL params
    useEffect(() => {
        if (searchParams) {
            // Amenities
            const newAmenities = {};
            amenityConfig.forEach(item => {
                if (searchParams[item.id] === 'true') {
                    newAmenities[item.id] = true;
                }
            });
            setSelectedAmenities(newAmenities);

            // Rooms
            if (searchParams.bedrooms) setBedrooms(parseInt(searchParams.bedrooms) || 0);
            if (searchParams.beds) setBeds(parseInt(searchParams.beds) || 0);
            if (searchParams.bathrooms) setBathrooms(parseInt(searchParams.bathrooms) || 0);

            // Price
            const minPrice = searchParams.minPrice ? parseInt(searchParams.minPrice) : 0;
            const maxPrice = searchParams.maxPrice ? parseInt(searchParams.maxPrice) : 5000;
            setPriceRange([minPrice, maxPrice]);
            
            // Category (Property Type)
            if (searchParams.category) setSelectedCategory(searchParams.category);
            
            // Location
            if (searchParams.location_value) setSelectedLocation(searchParams.location_value);
        }
    }, [searchParams]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('filter-modal-open');
        } else {
            document.body.style.overflow = 'unset';
            document.body.classList.remove('filter-modal-open');
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.classList.remove('filter-modal-open');
        };
    }, [showModal]);

    // Fetch property count when filters change
    useEffect(() => {
        const fetchCount = async () => {
            if (!showModal) return; // Only fetch when modal is open
            
            setIsCountLoading(true);
            
            const params = new URLSearchParams();
            
            // Add featureType (HOMES)
            params.set('featureType', 'HOMES');
            
            // Amenities
            Object.keys(selectedAmenities).forEach(key => {
                if (selectedAmenities[key]) {
                    params.set(key, "true");
                }
            });

            // Rooms
            if (bedrooms > 0) params.set("bedrooms", bedrooms);
            if (beds > 0) params.set("beds", beds);
            if (bathrooms > 0) params.set("bathrooms", bathrooms);

            // Price
            if (priceRange[0] > 0) params.set("minPrice", priceRange[0]);
            if (priceRange[1] < 5000) params.set("maxPrice", priceRange[1]);
            
            // Category and Location
            if (selectedCategory) params.set("category", selectedCategory);
            if (selectedLocation) params.set("location_value", selectedLocation);

            try {
                const response = await fetch(`/api/listings/count?${params.toString()}`);
                const data = await response.json();
                setPropertyCount(data.count);
            } catch (error) {
                console.error('Error fetching property count:', error);
                setPropertyCount(null);
            } finally {
                setIsCountLoading(false);
            }
        };

        fetchCount();
    }, [showModal, priceRange, bedrooms, beds, bathrooms, selectedAmenities, selectedCategory, selectedLocation]);

    const handleApplyFilters = () => {
        const params = new URLSearchParams(window.location.search);

        // Amenities
        Object.keys(selectedAmenities).forEach(key => {
            if (selectedAmenities[key]) {
                params.set(key, "true");
            } else {
                params.delete(key);
            }
        });

        // Rooms (Only set if > 0)
        if (bedrooms > 0) params.set("bedrooms", bedrooms);
        else params.delete("bedrooms");

        if (beds > 0) params.set("beds", beds);
        else params.delete("beds");

        if (bathrooms > 0) params.set("bathrooms", bathrooms);
        else params.delete("bathrooms");

        // Price
        // Only set if modified from defaults (assuming 0-5000 is default range logic)
        if (priceRange[0] > 0) params.set("minPrice", priceRange[0]);
        else params.delete("minPrice");

        if (priceRange[1] < 5000) params.set("maxPrice", priceRange[1]);
        else params.delete("maxPrice");
        
        // Category (Property Type)
        if (selectedCategory) params.set("category", selectedCategory);
        else params.delete("category");
        
        // Location
        if (selectedLocation) params.set("location_value", selectedLocation);
        else params.delete("location_value");

        // Add loading parameter to trigger loading state
        params.set("loading", "true");

        router.push(`/listings?${params.toString()}`);
        document.body.classList.remove('filter-modal-open');
        setShowModal(false);
    };

    const handleClearAll = () => {
        setPriceRange([0, 5000]);
        setBedrooms(0);
        setBeds(0);
        setBathrooms(0);
        setSelectedAmenities({});
        setSelectedCategory("");
        setSelectedLocation("");
    };

    const Counter = ({ label, value, onChange }) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <span style={{ fontSize: "16px", color: "#222", fontWeight: "400" }}>{label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <button
                    onClick={() => onChange(Math.max(0, value - 1))}
                    disabled={value === 0}
                    style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        border: `1px solid ${value === 0 ? "#DDDDDD" : "#717171"}`,
                        backgroundColor: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: value === 0 ? "not-allowed" : "pointer",
                        color: value === 0 ? "#DDDDDD" : "#222",
                        opacity: value === 0 ? 0.4 : 1,
                        transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => {
                        if (value > 0) {
                            e.currentTarget.style.borderColor = "#222";
                            e.currentTarget.style.transform = "scale(1.04)";
                        }
                    }}
                    onMouseOut={(e) => {
                        if (value > 0) {
                            e.currentTarget.style.borderColor = "#717171";
                            e.currentTarget.style.transform = "scale(1)";
                        }
                    }}
                >
                    <Minus size={16} />
                </button>
                <span style={{ width: "40px", textAlign: "center", fontSize: "16px", fontWeight: "400", color: "#222" }}>
                    {value === 0 ? (isRTL ? "الكل" : "Any") : value}
                </span>
                <button
                    onClick={() => onChange(value + 1)}
                    style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        border: "1px solid #717171",
                        backgroundColor: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#222",
                        transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = "#222";
                        e.currentTarget.style.transform = "scale(1.04)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = "#717171";
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                >
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => {
                    document.body.classList.add('filter-modal-open');
                    setShowModal(true);
                }}
                style={{
                    padding: "10px 16px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #DDDDDD",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#222222",
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    transition: "all 0.2s"
                }}
            >
                <SlidersHorizontal size={16} />
                <span>{isRTL ? "عوامل التصفية" : "Filters"}</span>
                {((Object.values(selectedAmenities).filter(Boolean).length + (bedrooms > 0 ? 1 : 0) + (beds > 0 ? 1 : 0) + (bathrooms > 0 ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0)) > 0) && (
                    <span style={{
                        backgroundColor: "#222222",
                        color: "#FFFFFF",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        fontSize: "11px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 4px"
                    }}>
                        {Object.values(selectedAmenities).filter(Boolean).length + (bedrooms > 0 ? 1 : 0) + (beds > 0 ? 1 : 0) + (bathrooms > 0 ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0)}
                    </span>
                )}
            </button>

            {/* Modal Overlay */}
            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        zIndex: 9999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 15px"
                    }}
                    onClick={() => {
                        document.body.classList.remove('filter-modal-open');
                        setShowModal(false);
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            width: "100%",
                            maxWidth: "600px",
                            height: "90vh",
                            maxHeight: "800px",
                            borderRadius: "20px",
                            display: "flex",
                            flexDirection: "column",
                            position: "relative",
                            animation: "slideUp 0.3s ease-out",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div
                            style={{
                                padding: "16px 24px",
                                borderBottom: "1px solid #EBEBEB",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                            }}
                        >
                            <button
                                onClick={() => {
                                    document.body.classList.remove('filter-modal-open');
                                    setShowModal(false);
                                }}
                                style={{
                                    position: "absolute",
                                    [isRTL ? 'right' : 'left']: "24px",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "4px",
                                    display: "flex",
                                }}
                            >
                                <X size={20} />
                            </button>
                            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>
                                {isRTL ? "عوامل التصفية" : "Filters"}
                            </h3>
                        </div>

                        {/* Content - Scrollable */}
                        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }} className="filter-content">

                            {/* Price Range */}
                            <section style={{ marginBottom: "40px" }}>
                                <h4 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "6px", textAlign: isRTL ? 'right' : 'left', color: "#1a1a1a" }}>
                                    {isRTL ? "نطاق السعر" : "Price range"}
                                </h4>
                                <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "28px", textAlign: isRTL ? 'right' : 'left' }}>
                                    {isRTL ? "سعر الليلة يشمل الرسوم والضرائب" : "Trip price, includes all fees"}
                                </p>

                                {/* Modern Range Slider */}
                                <div style={{ marginBottom: "24px", padding: "0 8px" }}>
                                    <div style={{ position: "relative", height: "40px" }}>
                                        {/* Track */}
                                        <div style={{
                                            position: "absolute",
                                            top: "18px",
                                            left: "0",
                                            right: "0",
                                            height: "4px",
                                            backgroundColor: "#e5e7eb",
                                            borderRadius: "4px"
                                        }}>
                                            {/* Active gradient range */}
                                            <div style={{
                                                position: "absolute",
                                                left: `${(priceRange[0] / 5000) * 100}%`,
                                                right: `${100 - (priceRange[1] / 5000) * 100}%`,
                                                height: "100%",
                                                background: "linear-gradient(90deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
                                                borderRadius: "4px",
                                                transition: "all 0.2s ease"
                                            }} />
                                        </div>
                                        
                                        {/* Min slider */}
                                        <input
                                            type="range"
                                            min={0}
                                            max={5000}
                                            step={50}
                                            value={priceRange[0]}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                if (value < priceRange[1] - 100) {
                                                    setPriceRange([value, priceRange[1]]);
                                                }
                                            }}
                                            style={{
                                                position: "absolute",
                                                width: "100%",
                                                top: "0",
                                                left: "0",
                                                height: "40px",
                                                appearance: "none",
                                                background: "transparent",
                                                cursor: "pointer",
                                                zIndex: 2
                                            }}
                                            className="modern-range-slider"
                                        />
                                        
                                        {/* Max slider */}
                                        <input
                                            type="range"
                                            min={0}
                                            max={5000}
                                            step={50}
                                            value={priceRange[1]}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                if (value > priceRange[0] + 100) {
                                                    setPriceRange([priceRange[0], value]);
                                                }
                                            }}
                                            style={{
                                                position: "absolute",
                                                width: "100%",
                                                top: "0",
                                                left: "0",
                                                height: "40px",
                                                appearance: "none",
                                                background: "transparent",
                                                cursor: "pointer",
                                                zIndex: 3
                                            }}
                                            className="modern-range-slider"
                                        />
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                                    <div style={{
                                        border: "2px solid #e5e7eb",
                                        borderRadius: "12px",
                                        padding: "16px 18px",
                                        flex: 1,
                                        backgroundColor: "#f9fafb",
                                        transition: "all 0.2s ease"
                                    }}
                                    className="price-input-box"
                                    >
                                        <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "6px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: isRTL ? 'right' : 'left' }}>
                                            {isRTL ? "الحد الأدنى" : "Minimum"}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                            <span style={{ fontSize: "15px", color: "#6b7280", fontWeight: "600" }}>MAD</span>
                                            <input
                                                type="number"
                                                min="0"
                                                max={priceRange[1]}
                                                value={priceRange[0]}
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value);
                                                    if (value <= priceRange[1]) {
                                                        setPriceRange([value || 0, priceRange[1]]);
                                                    }
                                                }}
                                                style={{
                                                    border: "none",
                                                    outline: "none",
                                                    width: "100%",
                                                    fontSize: "18px",
                                                    fontWeight: "700",
                                                    color: "#1a1a1a",
                                                    backgroundColor: "transparent",
                                                    textAlign: isRTL ? 'right' : 'left'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ fontSize: "20px", color: "#d1d5db", fontWeight: "300" }}>—</div>
                                    <div style={{
                                        border: "2px solid #e5e7eb",
                                        borderRadius: "12px",
                                        padding: "16px 18px",
                                        flex: 1,
                                        backgroundColor: "#f9fafb",
                                        transition: "all 0.2s ease"
                                    }}
                                    className="price-input-box"
                                    >
                                        <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "6px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: isRTL ? 'right' : 'left' }}>
                                            {isRTL ? "الحد الأقصى" : "Maximum"}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                            <span style={{ fontSize: "15px", color: "#6b7280", fontWeight: "600" }}>MAD</span>
                                            <input
                                                type="number"
                                                min={priceRange[0]}
                                                max="5000"
                                                value={priceRange[1]}
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value);
                                                    if (value >= priceRange[0]) {
                                                        setPriceRange([priceRange[0], value || 5000]);
                                                    }
                                                }}
                                                style={{
                                                    border: "none",
                                                    outline: "none",
                                                    width: "100%",
                                                    fontSize: "18px",
                                                    fontWeight: "700",
                                                    color: "#1a1a1a",
                                                    backgroundColor: "transparent",
                                                    textAlign: isRTL ? 'right' : 'left'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div style={{ width: "100%", height: "1px", backgroundColor: "#EBEBEB", margin: "32px 0" }} />

                            {/* Rooms and Beds */}
                            <section>
                                <h4 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "24px", textAlign: isRTL ? 'right' : 'left' }}>
                                    {isRTL ? "الغرف والأسرّة" : "Rooms and beds"}
                                </h4>
                                <Counter
                                    label={isRTL ? "غرف نوم" : "Bedrooms"}
                                    value={bedrooms}
                                    onChange={setBedrooms}
                                />
                                <Counter
                                    label={isRTL ? "أسرّة" : "Beds"}
                                    value={beds}
                                    onChange={setBeds}
                                />
                                <Counter
                                    label={isRTL ? "حمامات" : "Bathrooms"}
                                    value={bathrooms}
                                    onChange={setBathrooms}
                                />
                            </section>

                            <div style={{ width: "100%", height: "1px", backgroundColor: "#EBEBEB", margin: "32px 0" }} />

                            {/* Amenities */}
                            <section>
                                <h4 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "24px", textAlign: isRTL ? 'right' : 'left' }}>
                                    {isRTL ? "وسائل الراحة" : "Amenities"}
                                </h4>
                                <div style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "12px",
                                    direction: isRTL ? 'rtl' : 'ltr'
                                }}>
                                    {activeAmenities.slice(0, showAllAmenities ? activeAmenities.length : 6).map((item) => {
                                        const Icon = item.icon;
                                        const isSelected = selectedAmenities[item.id];
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => setSelectedAmenities(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    padding: "12px 16px",
                                                    border: `1px solid ${isSelected ? "#222222" : "#DDDDDD"}`,
                                                    borderRadius: "32px",
                                                    backgroundColor: isSelected ? "#F7F7F7" : "#FFFFFF",
                                                    cursor: "pointer",
                                                    transition: "all 0.15s ease",
                                                    fontSize: "14px",
                                                    fontWeight: "400",
                                                    color: "#222",
                                                    textAlign: isRTL ? 'right' : 'left',
                                                    whiteSpace: "nowrap"
                                                }}
                                                onMouseOver={(e) => {
                                                    if (!isSelected) {
                                                        e.currentTarget.style.borderColor = "#222";
                                                    }
                                                }}
                                                onMouseOut={(e) => {
                                                    if (!isSelected) {
                                                        e.currentTarget.style.borderColor = "#DDDDDD";
                                                    }
                                                }}
                                            >
                                                <Icon size={20} strokeWidth={1.5} />
                                                <span>{item.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {activeAmenities.length > 6 && (
                                    <button
                                        onClick={() => setShowAllAmenities(!showAllAmenities)}
                                        style={{
                                            marginTop: "16px",
                                            background: "none",
                                            border: "none",
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            color: "#222",
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                            padding: "8px 0",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px"
                                        }}
                                    >
                                        {showAllAmenities ? (isRTL ? "إظهار أقل" : "Show less") : (isRTL ? "إظهار المزيد" : "Show more")}
                                    </button>
                                )}
                            </section>
                        </div>

                        {/* Footer */}
                        <div
                            style={{
                                padding: "16px 24px",
                                borderTop: "1px solid #EBEBEB",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexDirection: isRTL ? 'row-reverse' : 'row',
                                backgroundColor: "#FFFFFF"
                            }}
                        >
                            <button
                                onClick={handleClearAll}
                                style={{
                                    border: "none",
                                    background: "none",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#222222",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                    padding: "8px 0"
                                }}
                            >
                                {isRTL ? "مسح الكل" : "Clear all"}
                            </button>
                            <button
                                onClick={handleApplyFilters}
                                style={{
                                    backgroundColor: "#222222",
                                    color: "#FFFFFF",
                                    padding: "14px 24px",
                                    borderRadius: "8px",
                                    border: "none",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    minWidth: "140px",
                                    transition: "transform 0.15s ease",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    justifyContent: "center"
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = "scale(1.02)";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                }}
                            >
                                {isCountLoading ? (
                                    <span>{isRTL ? "جاري التحميل..." : "Loading..."}</span>
                                ) : propertyCount !== null ? (
                                    <span>
                                        {isRTL 
                                            ? `عرض النتائج (${propertyCount})`
                                            : `Show results (${propertyCount})`
                                        }
                                    </span>
                                ) : (
                                    <span>{isRTL ? "عرض النتائج" : "Show results"}</span>
                                )}
                            </button>
                        </div>
                    </div>
                    <style jsx global>{`
						@keyframes slideUp {
							from { transform: translateY(50px); opacity: 0; }
							to { transform: translateY(0); opacity: 1; }
						}
						
						/* Lower header and search z-index when filter modal is open */
						body.filter-modal-open header {
							z-index: 1 !important;
						}
						
						body.filter-modal-open .listings-search-section {
							z-index: 1 !important;
						}
						
						/* Modern Range Slider */
						.modern-range-slider::-webkit-slider-thumb {
							-webkit-appearance: none;
							appearance: none;
							width: 24px;
							height: 24px;
							border-radius: 50%;
							background: #FFFFFF;
							border: 3px solid #FF385C;
							cursor: grab;
							box-shadow: 0 2px 8px rgba(255, 56, 92, 0.3), 0 0 0 4px rgba(255, 56, 92, 0.1);
							transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
						}
						
						.modern-range-slider::-webkit-slider-thumb:hover {
							transform: scale(1.2);
							box-shadow: 0 4px 12px rgba(255, 56, 92, 0.4), 0 0 0 6px rgba(255, 56, 92, 0.15);
						}
						
						.modern-range-slider::-webkit-slider-thumb:active {
							cursor: grabbing;
							transform: scale(1.1);
						}
						
						.modern-range-slider::-moz-range-thumb {
							width: 24px;
							height: 24px;
							border-radius: 50%;
							background: #FFFFFF;
							border: 3px solid #FF385C;
							cursor: grab;
							box-shadow: 0 2px 8px rgba(255, 56, 92, 0.3), 0 0 0 4px rgba(255, 56, 92, 0.1);
							transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
						}
						
						.modern-range-slider::-moz-range-thumb:hover {
							transform: scale(1.2);
							box-shadow: 0 4px 12px rgba(255, 56, 92, 0.4), 0 0 0 6px rgba(255, 56, 92, 0.15);
						}
						
						.modern-range-slider::-moz-range-thumb:active {
							cursor: grabbing;
							transform: scale(1.1);
						}
						
						/* Price Input Box Hover */
						.price-input-box:hover {
							border-color: #FF385C !important;
							background-color: #fff !important;
						}
						
						.price-input-box:focus-within {
							border-color: #FF385C !important;
							background-color: #fff !important;
							box-shadow: 0 0 0 3px rgba(255, 56, 92, 0.1) !important;
						}
						
						/* Mobile Responsive */
						@media (max-width: 640px) {
							.filter-content {
								padding: 20px 24px !important;
							}
							
							.modern-range-slider::-webkit-slider-thumb {
								width: 28px;
								height: 28px;
							}
							.modern-range-slider::-moz-range-thumb {
								width: 28px;
								height: 28px;
							}
						}
						
						@media (max-width: 480px) {
							.filter-content {
								padding: 16px 20px !important;
							}
						}
					`}</style>
                </div>
            )}
        </>
    );
};

export default ListingFilters;
