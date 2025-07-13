# Dynamic Wizard Setup Guide

This guide explains how to set up and configure the dynamic AI-powered wizards in FlexOS.

## Environment Variables

The wizard system requires the following environment variables to be configured:

### Required for AI Features
```bash
# OpenAI API Key - Required for AI-powered wizard interactions
OPENAI_API_KEY=your_openai_api_key_here

# Anthropic API Key - Optional, for Claude AI integration
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### Setting Up on Netlify

1. Go to your Netlify dashboard
2. Select your FlexOS site
3. Navigate to "Site settings" → "Environment variables"
4. Add the following variables:

   - Key: `OPENAI_API_KEY`
   - Value: Your OpenAI API key from https://platform.openai.com/api-keys
   - Scopes: Production (and optionally Preview)

5. Redeploy your site for changes to take effect

### Setting Up Locally

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API keys:
   ```bash
   OPENAI_API_KEY=your-openai-api-key-here
   ```

3. Restart your development server

## Testing Wizards

### Without AI (Test Mode)
If you don't have API keys yet, wizards will work in a limited mode:
- Basic conversation flow
- Pre-defined responses
- No AI analysis or generation

### With AI Enabled
When API keys are configured:
- Dynamic AI responses
- Website analysis
- Code generation
- Intelligent branching

## Available Wizards

1. **Website Refresh Wizard** (`/wizard/website-refresh`)
   - Analyzes existing websites
   - Suggests improvements
   - Generates updated code

2. **Component Generator** (`/wizard/component-generator`)
   - Creates Vue components
   - Follows FlexOS conventions
   - Includes TypeScript types

3. **Flexfluencer Wizard** (`/wizard/flexfluencer`)
   - Onboards influencers
   - Sets up promotional materials
   - Tracks performance

## Creating Custom Wizards

1. Create a YAML file in `/wizards/` directory
2. Define phases, inputs, and outputs
3. Configure AI prompts (optional)
4. Test locally before deploying

Example wizard structure:
```yaml
id: my-wizard
name: My Custom Wizard
description: Description here
icon: 🎯
phases:
  - id: phase1
    name: First Phase
    type: question
    prompt: Your prompt here
    inputType: text
```

## Troubleshooting

### Wizards Not Loading
- Check browser console for errors
- Verify YAML files are in `/wizards/` directory
- Ensure proper file permissions

### AI Features Not Working
- Verify API keys are set correctly
- Check API key quotas/limits
- Look for error messages in server logs

### Production Issues
- Ensure environment variables are set on Netlify
- Check build logs for missing files
- Verify `/wizards/` directory is included in build

## Support

For issues or questions:
- Check the browser console for errors
- Review server logs
- Open an issue on GitHub