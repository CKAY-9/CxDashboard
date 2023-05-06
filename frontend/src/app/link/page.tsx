import ClientLink from "./clientLink";
import ServerLink from "./serverLink";

const LinkServerPage = async () => {
    return (
        <>
            <title>Link</title>
            <ClientLink>
                <ServerLink></ServerLink>
            </ClientLink>
        </>
    );
}

export default LinkServerPage;