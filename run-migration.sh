#!/bin/bash
# Run chat system migration

echo "🚀 Running chat system migration..."
echo ""
echo "This script will create the necessary tables for the FlexOS chat system."
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed."
    echo "Please install it first: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Run the migration
echo "📦 Applying migration..."
supabase db push

if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully!"
    echo ""
    echo "The following tables have been created:"
    echo "  - chat_messages"
    echo "  - message_outputs"
    echo "  - message_actions"
    echo "  - wizard_sessions"
    echo ""
    echo "You can now use the chat system!"
else
    echo "❌ Migration failed. Please check the error messages above."
    exit 1
fi