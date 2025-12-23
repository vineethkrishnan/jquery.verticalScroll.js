# Contributing to jQuery Vertical Scroll

Thank you for your interest in contributing! Contributions from the community are welcome and appreciated.

## How to Contribute

### Reporting Bugs

Before reporting a bug, please check the existing
[Issues](https://github.com/vineethkrishnan/jquery.verticalScroll.js/issues).

If the issue hasn’t been reported, create a new issue including:
- A clear and descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Browser and jQuery version
- A minimal example or CodePen link (if possible)

### Suggesting Features

To suggest a new feature:
- Open an issue with the `enhancement` label
- Clearly describe the feature and its use case
- Include examples where possible

### Pull Requests

1. Fork the repository
2. Clone your fork locally
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. Make your changes in the `src/` directory
6. Build the distribution files:
   ```bash
   npm run build
   ```
7. Test your changes locally
8. Commit with a clear message:
   ```bash
   git commit -m "Add: brief description of changes"
   ```
9. Push your branch and open a Pull Request

## Development Setup

```bash
git clone https://github.com/vineethkrishnan/jquery.verticalScroll.js.git
cd jquery.verticalScroll.js
npm install
npm run build
```

## Project Structure

```
├── src/
│   ├── js/jquery.verticalScroll.js    # Main plugin source
│   └── css/jquery.verticalScroll.css  # Plugin styles
├── dist/                              # Built/minified files (auto-generated)
├── package.json
├── Gruntfile.js                       # Build configuration
└── README.md
```

## Code Style Guidelines

- Use 4 spaces for indentation
- Use single quotes for strings
- Add JSDoc comments for public methods
- Follow existing patterns and conventions
- Maintain backward compatibility with jQuery 1.9.1+

## Commit Message Guidelines

Use clear and descriptive commit messages:
- `Add: new feature description`
- `Fix: bug description`
- `Update: what was updated`
- `Docs: documentation changes`
- `Refactor: code refactoring`

## Questions or Support

If you have questions, feel free to open an issue or contact the maintainer at  
mail@vineethkrishnan.in

## License

By contributing, you agree that your contributions will be licensed under the  
MIT License.

