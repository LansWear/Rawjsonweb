# Quick Smoke Test for JSON Decode Fix

## 5-Minute Verification

### Test 1: Basic Decode (30 seconds)
1. Open `index.html` in browser
2. Click "解析 JSON" button
3. Paste: `{"rawtext":[{"text":"Hello"},{"selector":"@p"}]}`
4. Click "解析"
5. ✓ Should see "Hello [@p]" in editor

### Test 2: Error Handling (30 seconds)
1. Click "解析 JSON" again
2. Paste invalid JSON: `{not valid}`
3. Click "解析"
4. ✓ Should see red error message
5. ✓ Modal should stay open

### Test 3: Empty Input (15 seconds)
1. Clear the textarea (if needed, click "解析 JSON" again)
2. Leave textarea empty
3. Click "解析"
4. ✓ Should see error "请输入 JSON 内容"

### Test 4: Round-trip (45 seconds)
1. Clear editor (refresh page)
2. Type "Test " in editor
3. Insert a selector tag using the UI
4. Note the JSON output
5. Copy that JSON
6. Click "解析 JSON"
7. Paste the copied JSON
8. Click "解析"
9. ✓ Editor should show the same content
10. ✓ JSON output should match original

### Test 5: Automated Tests (1 minute)
1. Open `test-decode.html` in browser
2. ✓ All tests should show green checkmarks (✓)
3. ✓ No red X marks

## All Tests Pass?

If all checks above pass (✓), the fix is working correctly!

If any fail, check the browser console for errors and review the implementation.
