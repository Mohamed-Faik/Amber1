import Banner from "@/components/Index/Banner";
import Featured from "@/components/Index/Featured";
import { getCurrentUser } from "@/actions/getCurrentUser";

export const dynamic = "force-dynamic";

export default async function Home() {
	const currentUser = await getCurrentUser();

	return (
		<>
			<Banner />

			<Featured currentUser={currentUser} />
		</>
	);
}
