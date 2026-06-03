# Human guide: how this game will be built

You do not need to know game development to guide this project. The agent will make architecture and design defaults from the PRD, `CONTEXT.md`, and ADRs.

## What the agent owns by default

- Technical stack decisions already recorded in ADRs.
- Folder structure and test strategy.
- Breaking PRD sections into GitHub issues and vertical slices.
- Choosing placeholder assets that are safe enough for engineering.
- Keeping scope limited to MVP and no-backend constraints.
- Avoiding third-party IP risk.

## What the human may be asked for

- Taste checks: "Does this feel cheerful enough?"
- Child play-test observations: "Where did the child get stuck?"
- Asset preference when several safe sources are acceptable.
- Permission for external/destructive actions not already requested.

## Best route for assets

Do not commission or hunt final art first. Build mechanics with placeholders, then curate a consistent placeholder pack, then replace with production assets. This avoids wasted art work when mechanics change.

## Best route for development

1. Phase goals in `.omx/ultragoal/`.
2. GitHub issues describe tracer-bullet vertical slices.
3. Each slice gets tests first where practical.
4. Implement the smallest demoable path.
5. Play-test and revise.
6. Only then expand content.
