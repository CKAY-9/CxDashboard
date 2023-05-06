"use client";

import { NextPage } from "next";

const DashboardPageClient: NextPage<{children: any}> = ({children}) => {
    return (
        <>
            {children}
        </>
    );
}

export default DashboardPageClient;