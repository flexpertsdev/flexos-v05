# FlexOS Wizards

This directory contains YAML configuration files for the dynamic wizard system.

## Available Wizards

- **website-refresh.yaml** - Analyze and refresh websites with AI-powered improvements
- **component-generator.yaml** - Create Vue components following FlexOS best practices
- **flexfluencer.yaml** - Onboard influencers to promote community-built apps

## Creating New Wizards

1. Create a new YAML file in this directory
2. Follow the structure of existing wizards
3. Test locally at `/wizard-test` (development only)
4. The wizard will be automatically available at `/wizard/[wizard-id]`

## Deployment

Wizard files are automatically copied to the public directory during build.

For Netlify deployment, ensure your build command includes:
```bash
cp -r wizards public/wizards
```

## Testing

Visit `/wizard-test` in development mode to:
- View all available wizards
- Check AI service status
- Test wizard configurations
- Debug API responses