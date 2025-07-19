# Contributing to @oxog/kindof

First off, thank you for considering contributing to @oxog/kindof! It's people like you that make this library better for everyone.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Respect differing viewpoints and experiences

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include code samples and error messages**
- **Note your environment** (Node.js version, OS, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed functionality**
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes (`npm test`)
4. Make sure your code follows the style guidelines (`npm run lint`)
5. Ensure you maintain or improve code coverage
6. Update documentation as needed
7. Issue the pull request!

## Development Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/your-username/kindof.git
   cd kindof
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Run tests with coverage:
   ```bash
   npm run test:coverage
   ```

5. Build the project:
   ```bash
   npm run build
   ```

## Coding Guidelines

### TypeScript

- Use TypeScript for all new code
- Ensure proper type annotations
- Avoid using `any` type unless absolutely necessary
- Use interfaces for object shapes
- Export types that users might need

### Code Style

- We use ESLint and Prettier for code formatting
- Run `npm run lint` to check your code
- Run `npm run format` to auto-format
- Follow existing patterns in the codebase

### Testing

- Write tests for all new functionality
- Maintain or improve code coverage (currently at 91.82%)
- Test edge cases and error conditions
- Use descriptive test names
- Group related tests using `describe` blocks

### Commits

We follow conventional commits:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test additions or modifications
- `chore:` Build process or auxiliary tool changes

Example: `feat: add support for BigInt64Array detection`

### Documentation

- Update README.md if you change functionality
- Add JSDoc comments for public APIs
- Include examples in documentation
- Update type definitions if needed

## Project Structure

```
src/
├── core/          # Core type detection logic
├── guards/        # Type guard functions
├── converters/    # Type conversion utilities
├── validators/    # Schema validation
├── plugins/       # Plugin system
├── utils/         # Utility functions
└── types/         # TypeScript type definitions

tests/
└── unit/          # Unit tests for all modules
```

## Performance Considerations

- @oxog/kindof is designed to be fast and lightweight
- Avoid adding dependencies (we're zero-dependency!)
- Consider performance impact of changes
- Run benchmarks for performance-critical code
- Use caching where appropriate

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing! 🎉