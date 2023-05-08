"use client";

import Footer from "@/components/footer/footer";
import { NextPage } from "next";

const DashboardPageClient: NextPage<{children: any}> = ({children}) => {
    return (
        <>
            {children}
            <Footer></Footer>
        </>
    );
}

export default DashboardPageClient;