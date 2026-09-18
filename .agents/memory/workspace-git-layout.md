---
name: Workspace and deployment repositories
description: Boundary between the GitHub Pages source tree and the local Replit artifact workspace.
---

The GitHub Pages repository's `origin/main` is the SabrTime website tree, with the deployable SEO Toolkit at its root `seo-toolkit-src/`. The local Replit workspace also contains `artifacts/` projects and its own configuration; those files must not be discarded while syncing the deployment source.

**Why:** The two layouts share a Git repository history but are not interchangeable snapshots. Resetting the workspace to `origin/main` removed the local artifact files and workflows even though the GitHub website remained intact.

**How to apply:** Edit and build the deployment source at root `seo-toolkit-src/` for GitHub Pages. Preserve local `artifacts/` and Replit configuration files separately, and never force-push or reset the whole workspace to synchronize only the SEO Toolkit.