import ClientLink from "./clientLink";
import ServerLink from "./serverLink";

const LinkServerPage = async () => {
    return (
        <>
            <title>Link</title>
            <ClientLink>
                {/* @ts-expect-error Async Server Component */}
                <ServerLink></ServerLink>
            </ClientLink>
        </>
    );
}

export default LinkServerPage;