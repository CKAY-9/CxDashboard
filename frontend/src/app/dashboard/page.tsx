import DashboardPageClient from "./clientComponent";
import DashboardPageServer from "./serverComponent";

const Page = async () => {
    return (
        <>
            <DashboardPageClient>
                {/* @ts-expect-error Async Server Component */}
                <DashboardPageServer />
            </DashboardPageClient>
        </>
    );
}

export default Page;