# 📚 Smart Farming 360 - Documentation

## Quick Links

### Getting Started
- **[Setup Guide](../SETUP.md)** - Local development setup
- **[Quick Deploy](QUICK_DEPLOY.md)** - Deploy in 10 minutes

### Deployment
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Complete deployment guide
- **[Deployment Summary](DEPLOYMENT_SUMMARY.md)** - Executive summary
- **[Sync Improvements](SYNC_IMPROVEMENTS.md)** - Full stack sync details

### Features
- **[PWA Implementation](PWA_IMPLEMENTATION.md)** - Progressive Web App features
- **[PWA Testing](PWA_TESTING_GUIDE.md)** - Testing PWA features
- **[Formspree Integration](FORMSPREE_INTEGRATION.md)** - Contact form setup

### Configuration
- **[Ghana Updates](GHANA_UPDATES.md)** - Ghana-specific features
- **[GitHub Setup](GITHUB_SETUP.md)** - GitHub integration

### API
- **[API Documentation](../backend/API.md)** - Backend API reference

---

## Documentation Structure

```
docs/
├── DEPLOYMENT_GUIDE.md      # Complete deployment guide
├── DEPLOYMENT_SUMMARY.md    # Quick deployment overview
├── QUICK_DEPLOY.md          # 10-minute quick start
├── SYNC_IMPROVEMENTS.md     # Full stack sync details
├── PWA_IMPLEMENTATION.md    # PWA features guide
├── PWA_TESTING_GUIDE.md     # PWA testing guide
├── FORMSPREE_INTEGRATION.md # Contact form setup
├── GHANA_UPDATES.md         # Ghana-specific features
└── GITHUB_SETUP.md          # GitHub configuration
```

---

## Quick Reference

### Development
```bash
npm run dev              # Start development servers
npm run build            # Build for production
npm test                 # Run tests
```

### Deployment
```bash
npm run deploy:render:win    # Deploy to Render (Windows)
npm run verify:prod          # Verify deployment
```

### Testing
```bash
npm run verify              # Verify local build
npm run test:backend        # Backend tests
npm run test:frontend       # Frontend tests
```

---

## Need Help?

1. Check the relevant guide above
2. Run `npm run verify` to test your setup
3. Check [GitHub Issues](https://github.com/yourusername/smart-farming-360/issues)
4. Review logs in `backend/logs/`
