# playwright-saucedemo-framework

A modular UI automation framework built with Playwright and TypeScript for the SauceDemo application. Features Page Object Model (POM), custom fixtures, and automated CI-ready reporting.

## How to Run the Tests

### Headless Mode

Run all tests in headless mode (default):

```
npx playwright test
```

### Headed Mode

Run tests in headed mode (browser UI visible):

```
npx playwright test --headed
```

### Run in Parallel

Playwright runs tests in parallel by default. To control workers:

```
npx playwright test --workers=4
```

### Enable Traces and Screenshots

Traces and screenshots are automatically captured on test failures. Artifacts are saved in `traces/` and `screenshots/` folders. To view traces:

```
npx playwright show-trace traces/<trace-file>.zip
```

## Framework Design for Scalability & Maintainability

- Uses the Page Object Model (POM) pattern to keep UI logic separate from test logic.
- Utility functions (like screenshot/trace capture) are reusable across all tests.
- Test data and selectors are centralized for easy updates.
- Each page and component has its own class, making it easy to add new features or tests.

## Practices to Minimize Flaky Tests

- Explicit waits and assertions are used to ensure elements are ready before interacting.
- Only stable selectors (data-test, role, etc.) are used to avoid brittle locators.
- Tests are isolated and do not depend on each other.
- Cleanup and setup routines ensure a consistent starting state.

## Scaling to 1,000+ Tests

If the suite grew to 1,000 tests, the first change would be to:

- Split tests into multiple projects and folders for faster execution and easier management.
- Use test tagging and filtering to run only relevant tests.
- Integrate with a cloud grid or CI pipeline for distributed execution.
- Add more robust reporting and analytics to track flaky tests and failures.
