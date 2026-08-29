# Architecture - live-poll-master

## Structure
```
project-root/
  src/              - Source code
  tests/            - Test suite
  docs/             - Documentation
  .github/          - GitHub config
    workflows/      - CI/CD
    ISSUE_TEMPLATE/ - Templates
```

## Design Principles

### Separation of Concerns
Each module handles one responsibility.

### DRY
Shared utilities for common functionality.

### Clean Code
- Meaningful naming
- Small functions
- Error handling
- Documentation

## Security
- Input sanitization
- No hardcoded secrets
- Least privilege
- Dependency audits
