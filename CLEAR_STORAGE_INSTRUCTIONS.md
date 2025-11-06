# Clear LocalStorage Instructions

## Option 1: Browser Console (Recommended)
1. Press `F12` to open Developer Tools
2. Go to **Console** tab
3. Run this command:
```javascript
localStorage.clear();
location.reload();
```

## Option 2: Application Tab
1. Press `F12` to open Developer Tools
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Expand **Local Storage**
4. Right-click on your site domain
5. Click **Clear**
6. Refresh page (`Ctrl+R` or `F5`)

## Why?
Old messages in localStorage don't have the `sources` field, so they appear as empty arrays `[]`. Clearing localStorage will let the app create fresh messages with sources from `demo-chat-response.json`.

## After clearing:
- Send a new message
- You should see sources in console logs like:
  - `📦 Response data:` with sources array
  - `📚 Sources:` with actual source objects
  - `➕ addMessage called with sources:` with source data
