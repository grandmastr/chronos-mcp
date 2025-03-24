# Contributing to Chronos MCP

Thank you for your interest in contributing to the Chronos MCP project! This guide outlines our expectations and instructions to ensure a positive experience for everyone.

## Code of Conduct

Please treat fellow contributors and community members with respect and courtesy. We are committed to fostering an inclusive, respectful, and engaging environment. Any behavior that undermines these goals will not be tolerated.

## How to Contribute

We welcome your contributions. You can help improve this project by reporting bugs, suggesting enhancements, or submitting pull requests. Here’s how:

### Reporting Bugs

If you find an issue, please create a GitHub issue with the following details:
- Descriptive title of the bug.
- Steps to reproduce the bug.
- Expected vs. actual behavior.
- Relevant logs, screenshots, or error messages.
- Your setup details (OS, Node.js version, etc.).

### Suggesting Enhancements

For feature requests or improvements:
- Open an issue with a clear, descriptive title.
- Provide detailed explanations and mockups if applicable.
- Explain the benefits of the proposed enhancement.

### Pull Requests

When ready to contribute code:
1. Fork the repository.
2. Create a new branch (e.g., `git checkout -b feature/your-feature-name`).
3. Make your changes while following the project’s coding style.
4. Add or update tests to confirm your changes don’t break existing functionality.
5. Write clear commit messages using the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format.
6. Push your branch (`git push origin feature/your-feature-name`).
7. Open a pull request on GitHub.

## Project Structure

The Chronos MCP project is organized as follows:

```
stellar-new-mcp/
├── build/                    # Compiled output
├── src/
│   └── index.ts              # Main server entry point
├── package.json              # Project metadata and dependencies
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project overview and setup instructions
```

Familiarize yourself with the structure before making changes. If you’d like to add new tools or utilities, please follow our established patterns and update relevant documentation.

## Development Setup

To get started locally:
1. Clone your fork of the repository.
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Create a `.env` file for your configuration (refer to README.md for specifics).
4. Build the project:  
   ```bash
   npm run build
   ```
5. Run tests to verify your changes:  
   ```bash
   npm test
   ```

## Coding Standards

- Follow the existing code style and naming conventions.
- Write meaningful commit messages.
- Document your code where necessary.
- Update tests and documentation as needed.
- Ensure your changes pass all tests before submitting a pull request.

## Documentation

Keep the project documentation up to date. This includes:
- README.md
- This CONTRIBUTING.md file
- Inline code comments and external documentation

## License

By contributing, you agree that your contributions will be licensed under the project’s MIT License.

## Questions or Feedback

If you have any questions or need assistance, please open an issue on GitHub or contact the maintainers.

Thank you for helping to improve Chronos MCP!
