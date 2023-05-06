"use client";

import { setCookie } from "@/utils/cookie";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const ClientLogin = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        if (typeof(document) === undefined) return;
        if (token !== null) {
            setCookie("token", token, 365);
            redirect("/dashboard");
        }
    }, [typeof(document)]);

    return (
        <>
            <title>Login</title>
        </>
    );
}

export default ClientLogin;