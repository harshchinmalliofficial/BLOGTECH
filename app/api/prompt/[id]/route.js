import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import mongoose from "mongoose";

// GET Request - Fetch a single prompt by ID
export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const prompt = await Prompt.findById(params.id).populate("creator");

    if (!prompt) {
      return new Response("No prompt found", { status: 404 });
    }

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch prompt", { status: 500 });
  }
};

// PATCH Request - Update an existing prompt by ID
export const PATCH = async (request, { params }) => {
  const { prompt, tag } = await request.json();

  try {
    await connectToDB();

    const existingPrompt = await Prompt.findById(params.id);
    if (!existingPrompt) {
      return new Response("No prompt found", { status: 404 });
    }

    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;
    await existingPrompt.save();

    return new Response(JSON.stringify(existingPrompt), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to update the prompt", { status: 500 });
  }
};
export const DELETE = async (request, { params }) => {
  try {
    // Log the received ID
    console.log("Prompt ID:", params.id);

    // Validate the provided ID to ensure it's a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return new Response("Invalid ID format", { status: 400 });
    }

    // Connect to the database
    await connectToDB();

    // Attempt to find and remove the prompt by its ID
    const deletedPrompt = await Prompt.findByIdAndDelete(params.id);
    console.log("Deleted Prompt:", deletedPrompt);

    // If no prompt was found with that ID
    if (!deletedPrompt) {
      return new Response("No prompt found to delete", { status: 404 });
    }

    // Return success response
    return new Response("Prompt deleted successfully", { status: 200 });
  } catch (error) {
    // Log the error for debugging
    console.error("Error deleting prompt:", error);

    // Return a failure response with error details
    return new Response("Failed to delete the prompt", { status: 500 });
  }
};
