"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

import Profile from "@components/Profile";

const UserProfile = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const userName = searchParams.get("name");
    const userId = params?.id;

    const [userPosts, setUserPosts] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`/api/users/${userId}/posts`);
                let data = null;
                try {
                    data = await response.json();
                } catch {
                    data = null;
                }

                if (!response.ok || !Array.isArray(data)) {
                    setUserPosts([]);
                    setErrorMessage(typeof data?.error === "string" ? data.error : "Could not load prompts");
                    return;
                }

                setErrorMessage("");
                setUserPosts(data);
            } catch (error) {
                console.error("Failed to load user prompts:", error.message);
                setUserPosts([]);
                setErrorMessage("Could not load prompts");
            }
        };

        if (userId) fetchPosts();
    }, [userId]);

    return (
        <Profile
            name={userName}
            desc={`Welcome to ${userName}'s personalized profile page. Explore ${userName}'s exceptional prompts and be inspired by the power of their imagination`}
            data={userPosts}
            error={errorMessage}
        />
    );
};

export default UserProfile;
