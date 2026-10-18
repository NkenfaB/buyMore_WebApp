import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
const item = {
  _id: "1",
  name: "Cotton shirt",
  description: "Soft fabric",
  category: "Clothing",
  country: "Cameroon",
  tags: ["cotton"],
  imageUrl: "https://example.com/shirt.jpg",
};
afterEach(() => {
  jest.restoreAllMocks();
  delete global.fetch;
});
test("live catalog search and saved selection work", async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValue({ ok: true, json: async () => [item] });
  render(<App />);
  expect(
    await screen.findByRole("heading", { name: "Cotton shirt" })
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Save to selection" }));
  expect(
    screen.getByRole("button", { name: "Your selection (1)" })
  ).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText("Name, description or tag"), {
    target: { value: "not present" },
  });
  expect(screen.getByText("No pieces match this view.")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
  expect(
    screen.getByRole("heading", { name: "Cotton shirt" })
  ).toBeInTheDocument();
});
test("failed catalog request can be retried", async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({ ok: false })
    .mockResolvedValueOnce({ ok: true, json: async () => [] });
  render(<App />);
  expect(await screen.findByRole("alert")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(
    await screen.findByText("A new collection is on its way.")
  ).toBeInTheDocument();
});
