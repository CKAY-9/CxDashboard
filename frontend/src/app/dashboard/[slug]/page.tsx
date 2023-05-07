import ServerPageClient from "./clientComponent";
import ServerPageServer from "./serverComponent";
const ServerPage = async ({ params }: { params: { slug: string } }) => {
    return (
        <>
            <ServerPageClient>
                <ServerPageServer params={params} />
            </ServerPageClient>
        </>
    );
}

export default ServerPage;