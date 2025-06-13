"use server";

import { randomUUID } from "crypto";

let startTime: number | null = null;

export const startTypingTest = async () => {
  startTime = Date.now();
  const id = randomUUID();
  console.log(`Typing test ${id} started at ${startTime}`);
  return id;
}

export const finishTypingTest = async (id: string) => {
  if (startTime === null) {
    throw new Error("Typing test has not been started.");
  }

  const endTime = Date.now();
  const duration = endTime - startTime; // Duration in milliseconds
  startTime = null; // Reset start time for the next test

  // TODO save to db
  console.log(`Typing test ${id} finished in ${duration} ms`);

  return duration;
};
