"use client";

import Footer from "@/components/footer/footer";
import {createNotification} from "@/components/notification/noti";
import { NextPage } from "next";
import {useEffect} from "react";

const DashboardPageClient: NextPage<{children: any}> = ({children}) => {
    return (
        <>
            {children}
            <Footer></Footer>
        </>
    );
}

export default DashboardPageClient;
