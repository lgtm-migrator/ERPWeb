import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useState } from "react";
import SideBar from "../sidebar/sidebar";

type DashboardLayoutProps = {
    children: React.ReactNode,
};

const variants = {
    initial: {
        opacity: 0
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 1,
            ease: "easeInOut",
        },
    },
    exit: {
        y: '-100vh',
        opacity: 0,
        transition: {
            ease: [0.87, 0, 0.13, 1],
            duration: 1
        }
    },
}

const Layout = ({ children }: DashboardLayoutProps) => {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

    if (useRouter().pathname.includes("/dashboard")) {
        return (
            <main className="bg-gray-100 dark:bg-gray-800 h-screen w-screen overflow-hidden relative">
                <div className="flex items-start justify-start">
                    <div className="m-2">
                        <SideBar isCollapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} />
                    </div>
                    <motion.div className="w-screen h-screen" initial={variants.initial} animate={variants.animate} exit={variants.exit}>
                        {children}
                    </motion.div>
                </div>
            </main>
        );
    }

    return (
        <>
            {children}
        </>
    );
}

export default Layout;