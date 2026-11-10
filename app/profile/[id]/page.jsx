import { Suspense } from "react";

import UserProfile from "./UserProfile";

const Page = () => {
    return (
        <Suspense fallback={null}>
            <UserProfile />
        </Suspense>
    );
};

export default Page;
