"use client";

import { eraseCookie } from "@/utils/cookie";

const HeaderSignout = () => {
    return (
        <button onClick={() => {
            eraseCookie("token");
            window.location.href = "/";
        }}>Logout</button>
    )
}

export default HeaderSignout;
