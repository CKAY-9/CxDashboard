import style from "./command.module.scss";
import { CxSocket } from "../../socket/cxsocket";
import { BaseSyntheticEvent } from "react";

const CommandSender = (props: {socket: CxSocket}) => {

    const executeCommand = (e: BaseSyntheticEvent) => {
        e.preventDefault();
        props.socket
    }

    return (
        <>
            <div className={style.panel}> 
                <div className={style.content}>
                    <h1>Execute a custom command</h1>
                    <input type="text" name="command" placeholder="Custom Command"></input>
                    <button onClick={}></button>
                </div>
            </div>
        </>
    ); 
}

export default CommandSender;
