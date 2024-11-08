"use client";
import React, { useEffect, useState } from "react";
import Profile from "@components/Profile";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const MyProfile = () => {
  const { data: session } = useSession(); // Get session data
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!session?.user?.id) {
        console.error("User ID is missing in session.");
        return;
      }
      const response = await fetch(`/api/user/${session?.user?.id}/posts`);
      const data = await response.json();
      console.log("Posts fetched:", data);
      setPosts(data);
    };
    fetchPosts();
  }, [session]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const postId = post._id.toString();
    console.log("Deleting post with ID:", postId); // Log the ID being sent
    const hasConfirmed = confirm(
      `Are you sure you want to delete this prompt?`
    );

    if (hasConfirmed) {
      try {
        const response = await fetch(`/api/prompt/${postId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete the prompt");
        }

        // Filter out the deleted post from the posts state
        const filteredPosts = posts.filter((p) => p._id !== post._id);
        setPosts(filteredPosts);
      } catch (error) {
        console.error("Error in handleDelete:", error);
      }
    }
  };

  return (
    <div>
      <Profile
        name="My"
        desc="Welcome to your personalized profile page"
        data={posts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default MyProfile;
