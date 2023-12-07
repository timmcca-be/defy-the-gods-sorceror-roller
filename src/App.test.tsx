import React from "react";
import { render, screen } from "@testing-library/react";
import { App, exportedForTesting } from "./App";

describe("App", () => {
    it("renders spell names", () => {
        render(<App />);
        expect(screen.getByText(/chaos/i)).toBeInTheDocument();
    });
});

const { hasSubsetMatchingSum, hasSequentialSubset, hasEqualValues } =
    exportedForTesting;

describe("hasSubsetMatchingSum", () => {
    it("returns true when there is a subset of the given size with the given sum", () => {
        // 1 + 3 + 7
        expect(hasSubsetMatchingSum([1, 5, 7, 3, 4], 3, 11)).toBe(true);
    });

    it("returns false when there is no subset of the given size with the given sum", () => {
        expect(hasSubsetMatchingSum([1, 5, 7, 3, 4], 3, 17)).toBe(false);
    });
});

describe("hasSequentialSubset", () => {
    it("returns true when there is a sequential subset of the given size", () => {
        // 11 12 13
        expect(hasSequentialSubset([1, 9, 11, 13, 15, 16, 12], 3)).toBe(true);
    });

    it("returns false when there is no sequential subset of the given size", () => {
        expect(hasSequentialSubset([1, 9, 11, 13, 15, 16, 12], 4)).toBe(false);
    });
});

describe("hasEqualValues", () => {
    it("returns true when there are n of a kind", () => {
        // 6
        expect(hasEqualValues([6, 0, 6, 2, 2, 6, 1], 3)).toBe(true);
    });

    it("returns false when there are not n of a kind", () => {
        expect(hasEqualValues([6, 0, 6, 2, 2, 5, 1], 3)).toBe(false);
    });
});
