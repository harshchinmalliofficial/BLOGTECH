"use client"; // Marking this file as a Client Component

import React, { useState, useEffect, Suspense } from "react";
import Form from "@components/Form";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@components/loading"; // Import your loading component

const EditPrompt = () => {
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({ prompt: "", tag: "" });
  const router = useRouter();

  const PromptDetails = () => {
    const searchParams = useSearchParams();
    const promptId = searchParams.get("id");

    useEffect(() => {
      const getPromptDetails = async () => {
        if (promptId) {
          try {
            const response = await fetch(`/api/prompt/${promptId}`);
            const data = await response.json();
            setPost({ prompt: data.prompt, tag: data.tag });
          } catch (error) {
            console.error("Error fetching prompt details:", error);
          }
        }
      };

      getPromptDetails();
    }, [promptId]);

    return null; // No rendering here, just data fetching
  };

  const updatePrompt = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (!post.prompt || !post.tag) return alert("Prompt data is missing");

    try {
      const response = await fetch(`/api/prompt/${post._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error updating prompt:", errorText);
        alert("Failed to update prompt: " + errorText);
        return;
      }

      router.push("/"); // Redirect to homepage after successful update
    } catch (error) {
      console.error("Error in fetch request:", error);
      alert("An error occurred while updating the prompt.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Wrap only the part that uses useSearchParams */}
      <Suspense fallback={<Loading />}>
        {" "}
        {/* Using your Loading component here */}
        <PromptDetails />
      </Suspense>
      <Form
        type="Edit"
        post={post}
        setPost={setPost}
        submitting={submitting}
        handleSubmit={updatePrompt}
      />
    </div>
  );
};

export default EditPrompt;
