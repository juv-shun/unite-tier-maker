import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

// react-dndをモック
jest.mock("react-dnd", () => ({
  DndProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="dnd-provider">{children}</div>,
  useDrag: () => [{ isDragging: false }, jest.fn(), jest.fn()],
  useDrop: () => [{ isOver: false, canDrop: true }, jest.fn()],
}));

jest.mock("react-dnd-html5-backend", () => ({
  HTML5Backend: {},
}));

test("renders Pokemon Unite Tier Maker", () => {
  render(<App />);
  const titleElement = screen.getByText(/Pokemon Unite Tier Maker/i);
  expect(titleElement).toBeInTheDocument();
});
