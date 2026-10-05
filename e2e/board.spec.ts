import { test, expect } from "@playwright/test";

test("dashboard loads with seed tickets", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Support Triage Dashboard" })).toBeVisible();
  await expect(page.getByText("Production outage", { exact: false }).first()).toBeVisible();
});

test("new ticket gets triaged", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder(/Title/).fill("Urgent: checkout 500 errors for all users");
  await page.getByPlaceholder(/Describe the issue/).fill("Since this morning every checkout fails with a 500 error, enterprise customers blocked, need help ASAP");
  await page.getByPlaceholder(/customer@/).fill("test@acme.co");
  await page.getByRole("button", { name: /Submit ticket/ }).click();
  await expect(page.getByText(/Triaged as/i)).toBeVisible({ timeout: 15_000 });
});
