# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in AmaarBazaar, please email security@amaarbazaar.com with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

Please do not publicly disclose the vulnerability until we've had time to respond.

## Security Features

- **Content Security Policy (CSP)**: Restricts script execution to prevent XSS attacks
- **Admin Authentication**: Simple session-based login with 30-minute timeout
- **HTTPS**: All connections should use HTTPS in production
- **Input Validation**: Client-side validation on all forms
- **CORS**: Configured to restrict cross-origin requests
- **Robots.txt**: Blocks admin panel from search engine indexing

## Admin Access

The admin dashboard at `/admin.html` requires authentication:
- Default credentials (change in production): admin / bazaar2026
- Sessions expire after 30 minutes of inactivity
- All admin actions are logged (implement server-side)

## Deployment Checklist

Before deploying to production:
- [ ] Change default admin password
- [ ] Enable HTTPS
- [ ] Set secure CSP headers
- [ ] Configure CORS properly
- [ ] Enable rate limiting on auth endpoints
- [ ] Set up monitoring and logging
- [ ] Review and update security headers
- [ ] Enable HSTS header
- [ ] Implement server-side session validation
- [ ] Add database encryption for sensitive data

## Data Protection

- User passwords must be hashed (bcrypt, Argon2)
- Payment data must comply with PCI-DSS
- Payment processing should use established gateways (Stripe, bKash API)
- Implement proper access controls on all endpoints
- Regular security audits recommended

## Third-Party Services

- Google Fonts: For typography
- Unsplash: For sample product images (in demo)

Both are secure and widely used.
