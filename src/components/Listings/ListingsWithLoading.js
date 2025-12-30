"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Listings from "@/components/Listings/Index";

const ListingsWithLoading = ({ 
    currentUser, 
    totalPages, 
    listings, 
    searchParams, 
    totalCount, 
    startListingNumber, 
    endListingNumber 
}) => {
    const searchParamsHook = useSearchParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check if we have the loading parameter
        if (searchParamsHook.get('loading') === 'true') {
            setIsLoading(true);
            
            // Remove the loading parameter from URL
            const params = new URLSearchParams(searchParamsHook.toString());
            params.delete('loading');
            
            // Replace the URL without the loading parameter
            router.replace(`/listings?${params.toString()}`, { scroll: false });
            
            // Simulate loading completion after a short delay
            // In real scenario, this would be when data is actually loaded
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        }
    }, [searchParamsHook, router]);

    if (isLoading) {
        return (
            <div style={{ 
                display: "flex", 
                flexDirection: "column",
                alignItems: "center", 
                justifyContent: "center",
                minHeight: "400px",
                padding: "60px 20px"
            }}>
                {/* Spinning Loader */}
                <div style={{
                    width: "60px",
                    height: "60px",
                    border: "5px solid #fce4ec",
                    borderTop: "5px solid #E61E4D",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    marginBottom: "24px"
                }} />
                
                {/* Loading Text */}
                <p style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#E61E4D",
                    margin: "0",
                    letterSpacing: "0.5px"
                }}>
                    Loading properties...
                </p>

                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <Listings
            currentUser={currentUser}
            totalPages={totalPages}
            listings={listings}
            searchParams={searchParams}
            totalCount={totalCount}
            startListingNumber={startListingNumber}
            endListingNumber={endListingNumber}
        />
    );
};

export default ListingsWithLoading;
