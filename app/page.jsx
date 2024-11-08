import React from "react";
import Feed from "@components/Feed";
function Home() {
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center ">
        BLOGTECH
        <br classsname="max-md:hidden" />
        <span className="blue_gradient text-center">Ai-Powered Prompts</span>
      </h1>
      <p className="desc text-center">
        Welcome to BlogTech—your go-to hub for all things tech blogging! Whether
        you're an expert or a newcomer, we provide the tools, tips, and insights
        you need to create compelling tech content. Join our community and stay
        ahead with BlogTech!
      </p>
      <Feed />
    </section>
  );
}

export default Home;
