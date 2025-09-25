// CategoryLayout for exact positions while navigating and stuff

import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function CategoryLayout() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" }); // or "smooth"
    }, [pathname]);
    return <Outlet />;
}
