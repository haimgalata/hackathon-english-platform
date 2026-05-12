import { describe, expect, it } from "vitest";
import { generateBasicFeedback } from "../server/services/feedback/feedback.service";

describe("generateBasicFeedback", () => {
  it("detects grammar mistake", () => {
    const feedback = generateBasicFeedback("I am agree with this API design.");
    expect(feedback?.better).toContain("I agree");
  });

  it("detects terminology mistake", () => {
    const feedback = generateBasicFeedback("There is a bag in code.");
    expect(feedback?.better.toLowerCase()).toContain("bug");
  });
});
