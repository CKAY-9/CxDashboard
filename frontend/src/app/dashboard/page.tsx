import DashboardPageClient from "./clientComponent";
import DashboardPageServer from "./serverComponent";

const Page = async () => {
    return (
        <>
            <DashboardPageClient>
                <DashboardPageServer />
            </DashboardPageClient>
        </>
    );
}

export default Page;