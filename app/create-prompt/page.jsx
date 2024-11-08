"use client"; // Marking this file as a Client Component

import React, { useState, useEffect } from "react";
import Form from "@components/Form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Use `next/navigation` for client-side navigation in the app directory

const CreatePrompt = () => {
  // const [isClient, setIsClient] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({ prompt: "", tag: "" });
  const { data: session } = useSession();
  const router = useRouter();

  // This effect ensures useRouter is only used on the client side
  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  const createPrompt = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`/api/prompt/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure the content type is set to JSON
        },
        body: JSON.stringify({
          prompt: post.prompt,
          userId: session?.user.id,
          tag: post.tag,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error creating prompt:", errorText);
        alert("Failed to create prompt: " + errorText);
        return;
      }

      router.push("/"); // Redirect to homepage after successful creation
    } catch (error) {
      console.error("Error in fetch request:", error); // Log any fetch-related errors
      alert("An error occurred while creating the prompt.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Form
        type="Create"
        post={post}
        setPost={setPost}
        submitting={submitting}
        handleSubmit={createPrompt}
      />
    </div>
  );
};

export default CreatePrompt;
