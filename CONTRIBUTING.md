# Contributing to Smart Farming 360 🌾

First off, thank you for considering contributing to Smart Farming 360! It's people like you that make this platform better for Ghana's farming community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Node version, browser)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - why is this enhancement needed?
- **Proposed solution**
- **Alternative solutions** you've considered

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:

- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `documentation` - Documentation improvements

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Setup Steps

1. **Fork the repository**
   ```bash
   # Click the 'Fork' button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/smartfarm360.git
   cd smartfarm360
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/BRIGHTEDUFUL/smartfarm360.git
   ```

4. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

5. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

6. **Start development servers**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev
   
   # Frontend (Terminal 2)
   cd frontend
   npm run dev
   ```

## 🔄 Pull Request Process

1. **Update your fork**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow coding standards
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   # Backend tests
   cd backend
   npm test
   
   # Frontend build
   cd frontend
   npm run build
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Fill in the PR template
   - Link related issues

### PR Requirements

- ✅ Code follows project style guidelines
- ✅ Tests pass (if applicable)
- ✅ Documentation updated
- ✅ No merge conflicts
- ✅ Descriptive commit messages

## 💻 Coding Standards

### TypeScript/JavaScript

```typescript
// ✅ Good
const getUserById = async (id: number): Promise<User> => {
  const user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return user;
};

// ❌ Bad
const getUser = async (id) => {
  return await db.query('SELECT * FROM users WHERE id = ?', [id]);
};
```

### React Components

```typescript
// ✅ Good
interface Props {
  title: string;
  onSubmit: () => void;
}

const MyComponent: React.FC<Props> = ({ title, onSubmit }) => {
  return <div>{title}</div>;
};

// ❌ Bad
const MyComponent = (props) => {
  return <div>{props.title}</div>;
};
```

### CSS

```css
/* ✅ Good - BEM naming */
.product-card {
  padding: 20px;
}

.product-card__title {
  font-size: 18px;
}

.product-card--featured {
  border: 2px solid gold;
}

/* ❌ Bad */
.card {
  padding: 20px;
}

.title {
  font-size: 18px;
}
```

### General Guidelines

- Use **TypeScript** for type safety
- Write **meaningful variable names**
- Keep functions **small and focused**
- Add **comments** for complex logic
- Use **async/await** over promises
- Handle **errors properly**
- Write **tests** for new features

## 📝 Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(cart): add quantity update functionality"

# Bug fix
git commit -m "fix(auth): resolve token refresh issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Style
git commit -m "style(shop): improve product card spacing"

# Refactor
git commit -m "refactor(api): simplify error handling"

# Test
git commit -m "test(auth): add login endpoint tests"

# Chore
git commit -m "chore(deps): update dependencies"
```

## 🧪 Testing

### Writing Tests

```typescript
// Example test
describe('AuthService', () => {
  it('should hash password correctly', async () => {
    const password = 'test123';
    const hash = await AuthService.hashPassword(password);
    
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
  });
});
```

### Running Tests

```bash
# Backend tests
cd backend
npm test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 📚 Documentation

When adding new features, update:

- **README.md** - If it affects setup or usage
- **API.md** - If adding/changing API endpoints
- **Code comments** - For complex logic
- **JSDoc** - For functions and classes

## 🎨 Design Guidelines

### Colors

- Primary: `#2E7D32` (Green)
- Secondary: `#FF9800` (Orange)
- Success: `#4CAF50`
- Error: `#F44336`

### Typography

- Font: Plus Jakarta Sans
- Headings: 900 weight
- Body: 400-600 weight

### Spacing

- Use multiples of 4px (4, 8, 12, 16, 20, 24, etc.)
- Consistent padding and margins

## 🐛 Debugging

### Backend

```bash
# Enable debug logs
DEBUG=* npm run dev

# Check database
sqlite3 backend/smart_farming.db
```

### Frontend

```bash
# Check build
npm run build

# Preview production build
npm run preview
```

## 📞 Getting Help

- **GitHub Issues**: For bugs and features
- **Discussions**: For questions and ideas
- **Email**: brighteduful@gmail.com

## 🎉 Recognition

Contributors will be:

- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Smart Farming 360! 🌾**

Together, we're building something amazing for Ghana's farming community.
