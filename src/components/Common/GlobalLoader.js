"use client";

import React, { useState, useEffect } from "react";

const GlobalLoader = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Function to hide loader
        const hideLoader = () => {
            setLoading(false);
        };

        // Check if document is already loaded
        if (document.readyState === "complete") {
            hideLoader();
        } else {
            // Wait for window load event (waits for all resources including images)
            window.addEventListener("load", hideLoader);

            // Backup timeout in case load event fails or takes too long
            const timeoutId = setTimeout(hideLoader, 3000);

            return () => {
                window.removeEventListener("load", hideLoader);
                clearTimeout(timeoutId);
            };
        }
    }, []);

    if (!loading) return null;

    return (
        <div
            className="preloader"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 99999, // Ensure it's above everything including navbar
                backgroundColor: '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <div className="lds-ripple">
                <div className="preloader-container">
                    <div className="petal"></div>
                    <div className="petal"></div>
                    <div className="petal"></div>
                    <div className="petal"></div>
                    <div className="petal"></div>
                    <div className="petal"></div>
                    <div className="petal"></div>
                    <div className="petal"></div>
                    <div className="petal-1"></div>
                    <div className="petal-1"></div>
                    <div className="petal-1"></div>
                    <div className="ball"></div>
                </div>
            </div>
        </div>
    );
};

export default GlobalLoader;
