#!/bin/bash

echo "🚀 Running Enhanced Vision migration..."

# Run the migration
npx supabase db execute -f create_enhanced_vision_table.sql

echo "✅ Migration complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start chatting about your project in the Builder"
echo "2. Click 'Analyze Chat' in the Vision panel"
echo "3. Once readiness is 70%+, generate features, pages, journeys, and mockups!"
