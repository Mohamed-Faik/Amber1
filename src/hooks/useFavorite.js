import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

const useFavourite = ({ listingId, currentUser }) => {
	const router = useRouter();

	const hasFauvorited = useMemo(() => {
		const list = currentUser?.favourites || [];

		// const objectWithId2 = objectsArray.find(obj => obj.id === objectId);
		return list.find((fav) => fav.listingId === parseInt(listingId));
	}, [currentUser, listingId]);

	const toggleFavourite = useCallback(
		async (e) => {
			e.stopPropagation();
			if (!currentUser) {
				router.push("/auth/signin");
			}

			try {
				let request;
				if (hasFauvorited) {
					request = () =>
						axios.delete(`/api/favourites/${listingId}`);
				} else {
					request = () => axios.post(`/api/favourites/${listingId}`);
				}

				await request();
				router.refresh();
				toast.success("Success");
			} catch (error) {
				toast.error("Something went wrong");
			}
		},
		[currentUser, hasFauvorited, listingId, router]
	);

	return {
		hasFauvorited,
		toggleFavourite,
	};
};

export default useFavourite;
