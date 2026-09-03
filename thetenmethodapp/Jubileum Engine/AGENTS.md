# AGENTS.md — Jubileum Engine

Permanent instruction file for agent sessions working on this repository.

## Model assignments

- **Default coding model:** Kimi K2.7 Code (`openrouter/moonshotai/kimi-k2.7-code`). This is the model that performs all routine implementation, bug fixes, tests, and refactors.
- **Senior escalation agent:** `k3-senior`, backed by Kimi K3 (`openrouter/moonshotai/kimi-k3`). This agent is configured as a subagent and is invoked only for escalation scenarios.

## Escalation rules

Escalate to the `k3-senior` subagent when any of the following is true:

1. **Two failed bug-fix attempts** have been made on the same issue.
2. **Major cross-file or cross-module change** is required.
3. **Architecture change** is being proposed or needed.
4. **3+ subsystem coordination** is required.
5. **Context degradation** occurs (the current session is lost, repeating itself, or unable to make progress).

## Division of labor

- **K3 (`k3-senior`)** primarily diagnoses the problem and creates a concrete implementation plan.
- **K2.7 Code** performs the routine implementation after K3 hands the plan back.
- Do **not** use K3 for routine coding.

## Efficiency

Keep repository exploration targeted to minimize token usage. Read only what is needed to diagnose, plan, or implement.

## Provider restriction

OpenAI Codex models are not configured for this project. Do not add or enable them.
