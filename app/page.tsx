"use client";

import { useChat } from "ai/react";
import Header from "./header";
import Footer from "./footer";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({});

  const lastMessage = messages[messages.length - 1];
  const generatedBullets =
    lastMessage?.role === "assistant" ? lastMessage.content : null;

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Use AI to dramatically improve your resume
        </h1>
        <form onSubmit={handleSubmit} className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <p className="text-left font-medium">
              Enter your work experience as a list of bullet points.
            </p>
          </div>
          <textarea
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder="Enter your work experience here"
            rows={10}
            cols={50}
            onChange={handleInputChange}
            value={input}
          />
          {!isLoading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              type="submit"
            >
              Fix my resume &rarr;
            </button>
          )}
          {isLoading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <span className="loading">
                <span style={{ backgroundColor: "white" }} />
                <span style={{ backgroundColor: "white" }} />
                <span style={{ backgroundColor: "white" }} />
              </span>
            </button>
          )}
        </form>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <output className="space-y-10 my-10">
          {generatedBullets && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  // ref={captionRef}
                >
                  Your improved work experience
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                {generatedBullets.split("|").map((bullet, index) => {
                  return (
                    <div
                      className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                      onClick={() => {
                        navigator.clipboard.writeText(bullet);
                        toast("Item copied to clipboard", {
                          icon: "✂️",
                        });
                      }}
                      key={index}
                    >
                      <p>{bullet}</p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </output>
      </main>
      <Footer />
    </div>
  );
}
