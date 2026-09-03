import { useState, useCallback } from "react";
import type { LocationData } from "@/stores/useTimerStore";

interface GeolocationError {
    code: number;
    message: string;
}

interface UseGeolocationReturn {
    location: LocationData | null;
    loading: boolean;
    error: string | null;
    getCurrentLocation: () => Promise<LocationData | null>;
    clearLocation: () => void;
    permissionStatus: PermissionState | null;
}

export function useGeolocation(): UseGeolocationReturn {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [permissionStatus, setPermissionStatus] = useState<PermissionState | null>(null);

    const getCurrentLocation = useCallback(async (): Promise<LocationData | null> => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            // Check permission status first
            if (navigator.permissions) {
                const permission = await navigator.permissions.query({ name: "geolocation" });
                setPermissionStatus(permission.state);

                if (permission.state === "denied") {
                    setError("Location access denied. Please enable location in your browser settings.");
                    setLoading(false);
                    return null;
                }

                if (permission.state === "prompt") {
                    // Will trigger browser prompt on getCurrentPosition
                }
            }

            // Use Promise wrapper for getCurrentPosition
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                });
            });

            const { latitude, longitude, accuracy } = position.coords;

            // Try to reverse geocode using Nominatim (OpenStreetMap)
            let address: string | undefined;

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                    {
                        headers: {
                            "Accept": "application/json",
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    if (data.display_name) {
                        // Extract a simplified address
                        address = simplifyAddress(data.display_name);
                    }
                }
            } catch {
                // Reverse geocoding failed, continue without address
                console.warn("Reverse geocoding failed, using coordinates only");
            }

            const locationData: LocationData = {
                latitude,
                longitude,
                accuracy,
                address,
            };

            setLocation(locationData);
            return locationData;
        } catch (err) {
            const geolocationError = err as GeolocationError;
            let errorMessage = "Failed to get location";

            switch (geolocationError.code) {
                case 1: // PERMISSION_DENIED
                    errorMessage = "Location access denied. Please enable location permissions.";
                    break;
                case 2: // POSITION_UNAVAILABLE
                    errorMessage = "Location information is unavailable.";
                    break;
                case 3: // TIMEOUT
                    errorMessage = "Location request timed out.";
                    break;
                default:
                    errorMessage = geolocationError.message || "Failed to get location";
            }

            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearLocation = useCallback(() => {
        setLocation(null);
        setError(null);
    }, []);

    return {
        location,
        loading,
        error,
        getCurrentLocation,
        clearLocation,
        permissionStatus,
    };
}

/**
 * Simplifies a Nominatim display address to a short, readable format
 */
function simplifyAddress(fullAddress: string): string {
    const parts = fullAddress.split(",").map((p) => p.trim());

    if (parts.length === 0) return fullAddress;

    // Try to build a short address from key components
    const keyParts: string[] = [];

    for (const part of parts) {
        // Skip very long parts or generic terms
        if (part.length > 40) continue;
        if (["Unnamed Road", "Road", "Unclassified"].includes(part)) continue;

        keyParts.push(part);

        // Stop after 2-3 parts for brevity
        if (keyParts.length >= 3) break;
    }

    return keyParts.length > 0 ? keyParts.join(", ") : fullAddress;
}
