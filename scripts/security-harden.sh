#!/bin/bash
# Security hardening for .auth directory
# Run: chmod +x scripts/security-harden.sh && ./scripts/security-harden.sh

AUTH_DIR=".auth"
STORAGE_FILE=".auth/storage-state.json"

echo "🔒 Hardening .auth directory security..."

# 1. Create directory if not exists
mkdir -p "$AUTH_DIR"

# 2. Restrict permissions (owner only: rw-------)
chmod 700 "$AUTH_DIR"
if [ -f "$STORAGE_FILE" ]; then
    chmod 600 "$STORAGE_FILE"
fi

echo "✅ Directory permissions set to 700 (owner only)"
echo "✅ File permissions set to 600 (owner read/write only)"

# 3. Verify gitignore
if ! grep -q "^\.auth/" .gitignore 2>/dev/null; then
    echo "" >> .gitignore
    echo "# Auth states - sensitive session data" >> .gitignore
    echo ".auth/" >> .gitignore
    echo "✅ Added .auth/ to .gitignore"
fi

# 4. Check if file exists and warn about size
if [ -f "$STORAGE_FILE" ]; then
    SIZE=$(stat -f%z "$STORAGE_FILE" 2>/dev/null || stat -c%s "$STORAGE_FILE" 2>/dev/null)
    if [ "$SIZE" -gt 1048576 ]; then
        echo "⚠️  Warning: storage-state.json is >1MB, consider cleaning up"
    fi
    
    # Check for sensitive patterns
    if grep -q "eyJ" "$STORAGE_FILE" 2>/dev/null; then
        echo "⚠️  Warning: File contains base64-encoded data (possible tokens)"
    fi
fi

echo ""
echo "📋 Security checklist:"
echo "   • .auth/ is in .gitignore: ✓"
echo "   • Directory permissions: 700 (drwx------)"
echo "   • File permissions: 600 (-rw-------)"
echo ""
echo "🔐 Additional recommendations:"
echo "   1. Enable FileVault (macOS) or BitLocker (Windows) for disk encryption"
echo "   2. Use 'git status' before commit to verify .auth/ is not staged"
echo "   3. Consider 'git add -p' to review changes incrementally"
