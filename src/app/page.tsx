"use client";

import Schedule from "@/components/template/schedule";
import { useEffect, useRef } from "react";
import { animate, stagger } from "framer-motion";

// Custom splitText utility function
function customSplitText(
  element: HTMLElement,
  options?: { wordFormat?: (wordElement: HTMLElement) => void }
): { words: HTMLElement[] } {
  if (!element.textContent) {
    return { words: [] };
  }
  const text = element.textContent.trim();
  // Split by sequences of whitespace
  const wordsArray = text.split(/\s+/).filter((word) => word.length > 0);
  const wordElements: HTMLElement[] = [];

  element.innerHTML = ""; // Clear existing content

  wordsArray.forEach((wordStr, index) => {
    const wordSpan = document.createElement("span");
    wordSpan.textContent = wordStr;
    if (options?.wordFormat) {
      options.wordFormat(wordSpan);
    }
    element.appendChild(wordSpan);
    wordElements.push(wordSpan);

    // Add a space after each word span if it's not the last word
    if (index < wordsArray.length - 1) {
      element.appendChild(document.createTextNode(" "));
    }
  });

  return { words: wordElements };
}

export default function Home() {
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = textContainerRef.current;
    if (!container) return;

    const h4Element = container.querySelector("h4");
    const h1Element = container.querySelector("h1");

    if (!h4Element || !h1Element) return;

    document.fonts.ready.then(() => {
      if (!textContainerRef.current || !h4Element || !h1Element) return;

      textContainerRef.current.style.visibility = "visible";

      const addTailwindClassesToWord = (word: HTMLElement) => {
        word.classList.add(
          "inline-block", // Ensures proper layout and transform behavior
          "will-change-transform", // Optimizes transform animations
          "will-change-opacity" // Optimizes opacity animations
        );
      };

      // Use customSplitText instead of splitText from motion-plus
      const { words: h4Words } = customSplitText(h4Element, {
        wordFormat: addTailwindClassesToWord,
      });
      const { words: h1Words } = customSplitText(h1Element, {
        wordFormat: addTailwindClassesToWord,
      });

      // Animate h4 words
      animate(
        h4Words,
        { opacity: [0, 1], y: [10, 0] },
        {
          type: "spring",
          duration: 1.5, // Slightly shorter duration for subtitle
          bounce: 0,
          delay: stagger(0.05),
        }
      );

      // Animate h1 words, starting after h4 animation begins
      animate(
        h1Words,
        { opacity: [0, 1], y: [10, 0] },
        {
          type: "spring",
          duration: 2,
          bounce: 0,
          delay: h4Words.length * 0.05 * 0.5, // Delay before starting h1 animation
        }
      );
    });
  }, []);

  return (
    <div className="container sm:mx-auto min-h-screen">
      <main className="min-h-screen flex flex-col items-center justify-center mx-4 sm:mx-0 my-15 sm:my-20">
        <div
          className="mb-12"
          ref={textContainerRef}
          style={{ visibility: "hidden" }}
        >
          <h4 className="text-lg sm:text-2xl font-normal mb-4">
            The Big Schedule Agenda
          </h4>
          <h1 className="text-3xl sm:text-6xl font-light">
            What schedule would you like to create today?
          </h1>
        </div>
        <div className="w-full flex flex-col justify-center">
          <Schedule />
        </div>
      </main>
    </div>
  );
};