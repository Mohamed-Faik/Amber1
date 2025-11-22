import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const useFavourite = ({ listingId, currentUser }) => {
	const router = useRouter();
	
	// Initialize from currentUser data
	const initialFavorited = useMemo(() => {
		const list = currentUser?.favourites || [];
		return !!list.find((fav) => fav.listingId === parseInt(listingId));
	}, [currentUser, listingId]);

	// Local state for optimistic updates
	const [isFavorited, setIsFavorited] = useState(initialFavorited);
	const [isLoading, setIsLoading] = useState(false);

	// Sync with currentUser changes (e.g., after login)
	useEffect(() => {
		const list = currentUser?.favourites || [];
		const favorited = !!list.find((fav) => fav.listingId === parseInt(listingId));
		setIsFavorited(favorited);
	}, [currentUser, listingId]);

	const toggleFavourite = useCallback(
		async (e) => {
			e.stopPropagation();
			e.preventDefault();
			
			if (!currentUser) {
				router.push("/auth/signin");
				return;
			}

			if (isLoading) return; // Prevent double clicks

			// Optimistic update - update UI immediately
			const previousState = isFavorited;
			setIsFavorited(!isFavorited);
			setIsLoading(true);

			try {
				if (previousState) {
					await axios.delete(`/api/favourites/${listingId}`);
				} else {
					await axios.post(`/api/favourites/${listingId}`);
				}
				// Success - state already updated optimistically
			} catch (error) {
				// Revert on error
				setIsFavorited(previousState);
				toast.error("Failed to update favorite. Please try again.");
			} finally {
				setIsLoading(false);
			}
		},
		[currentUser, isFavorited, listingId, router, isLoading]
	);

	return {
		hasFauvorited: isFavorited,
		toggleFavourite,
	};
};

export default useFavourite;
