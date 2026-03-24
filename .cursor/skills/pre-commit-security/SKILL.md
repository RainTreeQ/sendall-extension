---
name: pre-commit-security
description: 每次提交前强制执行安全检查，确保敏感文件（如.auth/、.env等）不会被意外提交到Git仓库。Use before every git commit, git add, or any operation that stages files for commit.
metadata:
  short-description: Enforce security checks before git commit
---

# Pre-Commit Security Check

## Goal

- Prevent accidental commit of sensitive files (auth tokens, credentials, env files).
- Ensure `.auth/`, `.env`, and other sensitive patterns are never staged.
- Provide clear remediation steps if sensitive files are detected.

## Mandatory Check

**Before EVERY git commit, you MUST run:**

```bash
git status
```

### Verify List (must all pass)

- [ ] `.auth/` directory is NOT in "Changes to be committed"
- [ ] `.env` or `.env.local` is NOT in "Changes to be committed"
- [ ] `*.key`, `*.pem`, `*.p12`, `*.pfx` files are NOT in "Changes to be committed"
- [ ] No files containing `password`, `secret`, `credential`, `token` in filename are staged
- [ ] Log files (`.log`) are NOT in "Changes to be committed"

## Automated Enforcement

The repository has a pre-commit hook that blocks commits containing:
- `.auth/storage-state.json`
- `.env`, `.env.local`
- Potential hardcoded API keys (OpenAI, GitHub tokens)

**Hook location:** `.githooks/pre-commit`

## If Sensitive Files Are Staged

### Option 1: Unstage specific files
```bash
git restore --staged .auth/
git restore --staged .env
git restore --staged *.log
```

### Option 2: Unstage all and re-add carefully
```bash
git reset HEAD
# Then use git add -p to review changes incrementally
git add -p
```

### Option 3: Emergency cleanup (if already committed but not pushed)
```bash
git reset HEAD~1
git restore --staged .auth/
```

## Verification Commands

```bash
# Check what's staged
git diff --cached --name-only

# Check for sensitive patterns in staged files
git diff --cached --name-only | xargs grep -l "api_key\|password\|secret" 2>/dev/null

# Dry-run commit (see what would happen without committing)
git commit --dry-run
```

## Commit Checklist

Every commit MUST follow this checklist:

1. **Security Scan**
   ```bash
   git status
   # Confirm no .auth/, .env, *.log files staged
   ```

2. **Content Review**
   ```bash
   git diff --cached
   # Review all changes being committed
   ```

3. **Safe Commit**
   ```bash
   git commit -m "type(scope): description"
   ```

## Response Format

When asked to commit, ALWAYS respond with:

```markdown
**Pre-Commit Security Check**

Running `git status`...

```
[output of git status]
```

✅ Security check passed:
- [x] No `.auth/` files staged
- [x] No `.env` files staged
- [x] No log files staged
- [x] No sensitive patterns detected

Proceeding with commit...
```

If check fails:

```markdown
**⚠️ Pre-Commit Security Check FAILED**

Detected sensitive files staged for commit:
- `.auth/storage-state.json`

**Action Required:**
1. Unstage sensitive files: `git restore --staged .auth/`
2. Verify with `git status`
3. Retry commit

**Why:** These files contain authentication tokens that must never be committed.
```

## Non-negotiables

- NEVER bypass the security check with `git commit --no-verify`
- NEVER commit `.auth/` directory even if "temporary"
- NEVER assume "it's just for testing" - tokens in git history are forever
- If uncertain, ALWAYS ask before committing
