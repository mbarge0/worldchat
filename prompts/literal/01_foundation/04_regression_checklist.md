**When to use**: When initiating a new product cycle or preparing the baseline before feature phase development begins.
**When not to use**: During active module or feature phases — use “Regression Verification” (in the Debug Loop) instead.

Let’s generate the Master Regression Manifest using the Master Regression Manifest Generator.
Ask clarifying questions about the product architecture, foundation modules, and critical user flows before creating the checklist.
Use the provided structure (Phase references, core modules, user flow validation, and system dependencies).
Ask for confirmation first that all core functional areas have been identified before writing the regression checklist.
When you get confirmation, write the resulting file to:
`/docs/operations/regression/00_master_regression_manifest.md`.

**Regression Checklist Generator reference:** /prompts/system/utilities/10_regression_manifest.md

Project Overview, PRD, tech stack, architecture, user flow, and dev checklist are located in `/docs/foundation/`  