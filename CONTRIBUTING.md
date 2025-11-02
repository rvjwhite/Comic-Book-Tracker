# Contributing to Comic Book Tracker

Thank you for your interest in contributing to Comic Book Tracker! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, gender, gender identity, sexual orientation, disability, personal appearance, race, ethnicity, age, religion, or nationality.

### Expected Behavior

- Be respectful and considerate
- Be collaborative and constructive
- Focus on what is best for the project
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling or personal attacks
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB (local or Atlas)
- Git
- MetaMask (for NFT features)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Comic-Book-Tracker.git
   cd Comic-Book-Tracker
   ```

3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/ORIGINAL-OWNER/Comic-Book-Tracker.git
   ```

### Setup Development Environment

1. Run the setup script:
   ```bash
   ./setup.sh  # macOS/Linux
   setup.bat   # Windows
   ```

2. Configure environment variables (see SETUP_GUIDE.md)

3. Start development servers:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/add-csv-import`)
- `fix/` - Bug fixes (e.g., `fix/login-validation`)
- `docs/` - Documentation updates (e.g., `docs/update-api-docs`)
- `refactor/` - Code refactoring (e.g., `refactor/collection-service`)
- `test/` - Adding or updating tests (e.g., `test/appraisal-unit-tests`)

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

## Coding Standards

### Backend (Node.js/Express)

- Use ES6+ features
- Follow RESTful API conventions
- Use async/await for asynchronous operations
- Add JSDoc comments for functions
- Handle errors properly with try/catch
- Validate input data

Example:
```javascript
/**
 * Get collection statistics for user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Collection statistics
 */
const getStats = async (req, res) => {
  try {
    const stats = await calculateStats(req.user._id);
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Frontend (React)

- Use functional components with hooks
- Follow React best practices
- Use Material-UI components consistently
- Implement proper error boundaries
- Handle loading states
- Clean up effects and subscriptions

Example:
```javascript
function CollectionList() {
  const dispatch = useDispatch();
  const { collections, isLoading } = useSelector(state => state.collection);

  useEffect(() => {
    dispatch(getCollections());
  }, [dispatch]);

  if (isLoading) return <CircularProgress />;

  return (
    <Grid container spacing={2}>
      {collections.map(comic => (
        <ComicCard key={comic._id} comic={comic} />
      ))}
    </Grid>
  );
}
```

### Smart Contracts (Solidity)

- Follow Solidity style guide
- Use OpenZeppelin contracts when possible
- Add NatSpec comments
- Implement proper access control
- Emit events for important state changes
- Write comprehensive tests

Example:
```solidity
/**
 * @dev Mint a new comic book NFT
 * @param to Address to mint the NFT to
 * @param title Comic book title
 * @return tokenId The ID of the minted token
 */
function mintComicNFT(
    address to,
    string memory title,
    // ... other parameters
) public returns (uint256) {
    require(to != address(0), "Cannot mint to zero address");
    // ... implementation
    emit ComicMinted(tokenId, to, title);
    return tokenId;
}
```

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(collection): add CSV import functionality

Implement CSV import feature that allows users to bulk import
their comic collection from a CSV file.

- Add CSV parser service
- Create import UI component
- Add validation for CSV format
- Update API endpoint for batch creation

Closes #42
```

```
fix(auth): resolve JWT token expiration issue

Fix bug where JWT tokens were expiring prematurely due to
incorrect expiration time calculation.

Fixes #56
```

## Pull Request Process

### Before Submitting

1. **Update from main**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests**:
   ```bash
   # Backend
   cd backend && npm test

   # Frontend
   cd frontend && npm run build

   # Contracts
   cd contracts && npx hardhat test
   ```

3. **Check environment config**:
   ```bash
   node scripts/check-env.js
   ```

4. **Lint your code**:
   ```bash
   npm run lint --if-present
   ```

### Submitting Pull Request

1. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create pull request on GitHub

3. Fill out the PR template:
   - Description of changes
   - Related issue number
   - Testing performed
   - Screenshots (if UI changes)

4. Request review from maintainers

### PR Review Checklist

- [ ] Code follows project conventions
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console.log or debugging code
- [ ] Environment variables documented
- [ ] Breaking changes noted

## Testing

### Backend Tests

```bash
cd backend
npm test
```

Create tests in `backend/tests/`:
```javascript
describe('Collection API', () => {
  it('should create a new collection', async () => {
    const res = await request(app)
      .post('/api/collections')
      .set('Authorization', `Bearer ${token}`)
      .send(collectionData);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
```

### Frontend Tests

Add component tests using React Testing Library:
```javascript
import { render, screen } from '@testing-library/react';
import ComicCard from './ComicCard';

test('renders comic title', () => {
  render(<ComicCard comic={mockComic} />);
  expect(screen.getByText('Amazing Spider-Man')).toBeInTheDocument();
});
```

### Smart Contract Tests

```bash
cd contracts
npx hardhat test
```

Write comprehensive tests:
```javascript
describe('ComicBookNFT', () => {
  it('Should mint a new comic NFT', async () => {
    await comicBookNFT.mintComicNFT(
      addr1.address,
      'Spider-Man',
      'Marvel',
      '1',
      'Mint',
      'ipfs://...'
    );
    expect(await comicBookNFT.ownerOf(0)).to.equal(addr1.address);
  });
});
```

## Documentation

### Update Documentation

When making changes, update relevant documentation:

- `README.md` - Main project overview
- `SETUP_GUIDE.md` - Installation instructions
- `API_DOCUMENTATION.md` - API endpoints
- `ARCHITECTURE.md` - System design
- Inline code comments

### Adding Features

When adding new features:

1. Update API documentation
2. Add usage examples
3. Update ARCHITECTURE.md if needed
4. Add to README roadmap if applicable

## Areas for Contribution

### High Priority

- Integration with external pricing APIs (GoCollect, GPAnalysis)
- Bulk CSV import/export
- Advanced analytics and reporting
- Mobile responsive improvements
- Accessibility improvements (WCAG compliance)

### Medium Priority

- Collection sharing features
- Advanced search and filtering
- Price history charts
- IPFS integration for images
- Multi-language support

### Good First Issues

- UI/UX improvements
- Adding more comic publishers
- Writing additional tests
- Documentation improvements
- Bug fixes

## Questions?

- Open an issue for bugs
- Start a discussion for feature ideas
- Join our community chat (if available)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Comic Book Tracker! 🎉
