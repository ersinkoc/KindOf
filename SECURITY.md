# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of @oxog/kindof seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: security@oxog.io

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

### What to Include

Please include the following information in your report:

- Type of issue (e.g., buffer overflow, type confusion, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to Expect

After you submit a vulnerability report:

1. We will acknowledge receipt of your report within 48 hours
2. We will work to verify the issue and determine its impact
3. We will release a fix as soon as possible, depending on complexity
4. We will notify you when the fix has been released
5. We will publicly acknowledge your responsible disclosure, unless you prefer to remain anonymous

## Security Best Practices

When using @oxog/kindof:

1. **Always validate input**: While kindof provides type detection, always validate untrusted input
2. **Use type guards**: Leverage the built-in type guards for safe type narrowing
3. **Handle edge cases**: Be aware that some type detections may have edge cases
4. **Keep updated**: Always use the latest version for security patches
5. **Report issues**: If you notice unexpected behavior, report it immediately

## Zero Dependencies

@oxog/kindof has zero external dependencies, which significantly reduces the attack surface. We intend to keep it this way to maintain security and reliability.

## Contact

For any security-related questions or concerns, please contact: security@oxog.io