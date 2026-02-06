import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="grid grid-cols-12">
            <div className="col-span-2">
                <Navbar />
            </div>
            <div className="col-span-10">{children}</div>
        </div>
    );
};

export default Layout;
