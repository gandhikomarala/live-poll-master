# Test Suite - live-poll-master

## Structure
```
tests/
  unit/           - Unit tests
  integration/    - Integration tests
  fixtures/       - Test data
```

## Running Tests
```bash
python -m pytest tests/ -v
# or: npm test
# or: make test
```

## Coverage
```bash
python -m pytest tests/ --cov=src --cov-report=html
```

## Guidelines
1. One assertion per test
2. Descriptive names
3. Arrange-Act-Assert pattern
4. Mock external deps
5. Independent tests

## Requirements
- Minimum 70% coverage
- New code must include tests
