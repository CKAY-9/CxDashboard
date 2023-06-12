import ConfigClient from "./clientComponent";
import ConfigServer from "./serverComponent";

const ConfigPage = ({ params }: { params: { slug: string } }) => {
    return (
        <>
            <ConfigClient>
                {/* @ts-expect-error Async Server Component */}
                <ConfigServer params={params} />  
            </ConfigClient> 
        </>
    ); 
}

export default ConfigPage;
