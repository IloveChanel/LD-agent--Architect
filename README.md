# Architect

Eighth agent for Logically Done. Open this folder in Visual Studio Code or Visual Studio.

It reads a file map only: paths, folders, and package.json dependency names. It does not read source files.

The box returns three things: what is wrong, which earlier agent should run next, and the prompt to paste into that agent.

```text
npm start -- . "Convert this web dashboard into an Expo mobile app"
```

The live page calls `/api/owner/logically-done/architect`.
