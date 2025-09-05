# 🔄 Upstream Updates Guide

This guide explains how to check for and apply updates from the original `once-ui-system/magic-portfolio` repository while preserving your customizations.

## 📋 Repository Setup Overview

- **origin**: Your repository (`Ragulsundaram/magicporfolio`)
- **upstream**: Original repository (`once-ui-system/magic-portfolio`)
- **Working branch**: `main` (contains your customizations)

## 🔍 Checking for Updates from Original Repository

### 1. Fetch Latest Changes from Upstream

```bash
# Fetch all branches and commits from the original repository
git fetch upstream

# Fetch only the main branch
git fetch upstream main
```

### 2. Check What's New in Original Repository

```bash
# See commits that are in upstream/main but not in your main branch
git log --oneline main..upstream/main

# See a more detailed view with file changes
git log --stat main..upstream/main

# See just the commit count
git rev-list --count main..upstream/main
```

### 3. Preview Changes Before Applying

```bash
# See what files would be affected
git diff --name-only main upstream/main

# See actual code differences
git diff main upstream/main

# See changes for a specific file
git diff main upstream/main -- src/components/Header.tsx
```

## 🛠️ Applying Updates from Original Repository

### Option A: Merge Strategy (Recommended for most cases)

```bash
# 1. Make sure you're on your main branch
git checkout main

# 2. Fetch latest upstream changes
git fetch upstream

# 3. Merge upstream changes into your branch
git merge upstream/main

# 4. If conflicts occur, resolve them manually
# Edit conflicted files, then:
git add .
git commit -m "Resolve merge conflicts with upstream updates"

# 5. Push updates to your repository
git push origin main
```

### Option B: Rebase Strategy (For cleaner history)

```bash
# 1. Make sure you're on your main branch
git checkout main

# 2. Fetch latest upstream changes
git fetch upstream

# 3. Rebase your changes on top of upstream
git rebase upstream/main

# 4. If conflicts occur during rebase:
# - Resolve conflicts in each file
# - Stage resolved files: git add <file>
# - Continue rebase: git rebase --continue
# - Repeat until rebase is complete

# 5. Force push to your repository (be careful!)
git push origin main --force-with-lease
```

## 🚨 Handling Merge Conflicts

When conflicts occur, you'll see files marked like this:

```
<<<<<<< HEAD
Your customized code
=======
Original repository code
>>>>>>> upstream/main
```

### Resolution Steps:

1. **Identify conflicted files**:
   ```bash
   git status
   ```

2. **Open each conflicted file** and manually resolve:
   - Keep your changes
   - Keep upstream changes
   - Combine both (most common)

3. **Stage resolved files**:
   ```bash
   git add <resolved-file>
   ```

4. **Complete the merge**:
   ```bash
   git commit -m "Merge upstream updates with local customizations"
   ```

## 📦 Common Conflict Scenarios & Solutions

### 1. Your Customizations vs Upstream Changes

**Files likely to conflict:**
- `src/resources/content.tsx` (your contact page config)
- `src/resources/icons.ts` (your outlined icons)
- `src/components/Header.tsx` (your contact navigation)
- `src/resources/once-ui.config.ts` (your disabled gallery)

**Resolution Strategy:**
- **Keep your customizations** for contact page features
- **Accept upstream changes** for bug fixes and new features
- **Combine both** when possible

### 2. Package Dependencies

**If `package.json` conflicts:**
```bash
# Update dependencies while keeping your additions
npm install
# Or if major version conflicts:
npm update
```

### 3. New Features from Upstream

**When upstream adds new pages/components:**
- Review if they conflict with your customizations
- Integrate new features while preserving your contact page
- Update your configurations to include new features if desired

## 🔄 Regular Maintenance Workflow

### Weekly/Monthly Check (Recommended)

```bash
# 1. Check for updates
git fetch upstream
git log --oneline main..upstream/main

# 2. If updates exist, review them
git log --stat main..upstream/main

# 3. Apply updates if beneficial
git merge upstream/main

# 4. Test your site
npm run build
npm run dev

# 5. Push to your repository
git push origin main
```

## 🛡️ Backup Strategy Before Major Updates

```bash
# Create a backup branch before major updates
git checkout -b backup-before-update-$(date +%Y%m%d)
git push origin backup-before-update-$(date +%Y%m%d)

# Return to main and proceed with updates
git checkout main
```

## 🚀 Testing After Updates

```bash
# 1. Install any new dependencies
npm install

# 2. Build the project
npm run build

# 3. Test development server
npm run dev

# 4. Test your customizations specifically:
# - Contact page functionality
# - Navigation with contact button
# - Outlined icons display
# - Gallery page is still disabled
```

## 📋 Update Checklist

- [ ] Fetch upstream changes
- [ ] Review what's new
- [ ] Backup current state (for major updates)
- [ ] Apply updates (merge/rebase)
- [ ] Resolve any conflicts
- [ ] Test build process
- [ ] Test contact page functionality
- [ ] Test navigation and icons
- [ ] Verify gallery remains disabled
- [ ] Push to your repository

## 🔧 Troubleshooting

### If something goes wrong:

```bash
# Abort current merge
git merge --abort

# Reset to previous state (lose uncommitted changes)
git reset --hard HEAD

# Reset to specific commit
git reset --hard <commit-hash>

# Restore from backup branch
git checkout backup-before-update-YYYYMMDD
git checkout -b main-recovered
```

### Get help with conflicts:

```bash
# See which files have conflicts
git diff --name-only --diff-filter=U

# Use a visual merge tool
git mergetool
```

## 📚 Useful Commands Reference

| Command | Purpose |
|---------|---------|
| `git fetch upstream` | Get latest changes from original repo |
| `git log main..upstream/main` | See new commits |
| `git diff main upstream/main` | See code differences |
| `git merge upstream/main` | Apply upstream changes |
| `git status` | Check current state |
| `git push origin main` | Push to your repository |

---

**💡 Pro Tip**: Always test your customizations after applying upstream updates to ensure everything still works as expected!

**🔗 Your Repositories:**
- Your repo: https://github.com/Ragulsundaram/magicporfolio.git
- Original repo: https://github.com/once-ui-system/magic-portfolio.git
