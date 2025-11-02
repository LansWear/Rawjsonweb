# JSON Decode Manual Testing Guide

This document provides manual testing steps to verify the JSON decode functionality works correctly.

## Test Setup

1. Open `index.html` in a web browser
2. Click the "解析 JSON" button in the menu to open the decode modal

## Test Case 1: Valid RawJSON with Plain Text

**Steps:**
1. In the decode modal, paste the following JSON:
```json
{"rawtext":[{"text":"Hello World"}]}
```
2. Click "解析" button

**Expected Result:**
- Modal closes
- Text "Hello World" appears in the rich text editor
- JSON output regenerates correctly
- No console errors

## Test Case 2: Valid RawJSON with Selector

**Steps:**
1. Clear the editor (refresh page or select all and delete)
2. Open decode modal again
3. Paste:
```json
{"rawtext":[{"selector":"@p"}]}
```
4. Click "解析" button

**Expected Result:**
- Modal closes
- A selector tag appears in the editor showing "[@p]"
- Clicking the tag opens the selector editor
- JSON output shows correct selector format

## Test Case 3: Valid RawJSON with Score

**Steps:**
1. Clear the editor
2. Open decode modal
3. Paste:
```json
{"rawtext":[{"score":{"name":"@s","objective":"points"}}]}
```
4. Click "解析" button

**Expected Result:**
- Modal closes
- A score tag appears showing "[@s:points]"
- Clicking the tag opens the score editor
- JSON output is correct

## Test Case 4: Valid RawJSON with Translate

**Steps:**
1. Clear the editor
2. Open decode modal
3. Paste:
```json
{"rawtext":[{"translate":"welcome.message","with":[{"text":"Player"}]}]}
```
4. Click "解析" button

**Expected Result:**
- Modal closes
- A translate tag appears showing "[t:welcome.message]"
- Clicking the tag opens the translate editor
- JSON output is correct

## Test Case 5: Invalid JSON Syntax

**Steps:**
1. Open decode modal
2. Paste invalid JSON:
```
{ this is not valid json }
```
3. Click "解析" button

**Expected Result:**
- Error message appears in red above the textarea
- Error message says something like "JSON 解析失败" or "Unexpected token"
- Modal remains open
- Editor is unchanged

## Test Case 6: Missing rawtext Array

**Steps:**
1. Open decode modal
2. Paste:
```json
{"text":"Hello"}
```
3. Click "解析" button

**Expected Result:**
- Error message appears showing "无效的 RawJSON 格式：需要包含 'rawtext' 数组"
- Modal remains open
- Editor is unchanged

## Test Case 7: Empty Input

**Steps:**
1. Open decode modal
2. Leave textarea empty
3. Click "解析" button

**Expected Result:**
- Error message appears showing "请输入 JSON 内容"
- Modal remains open

## Test Case 8: Complex Mixed Content

**Steps:**
1. Clear the editor
2. Open decode modal
3. Paste:
```json
{"rawtext":[{"text":"Player: "},{"selector":"@p"},{"text":" has "},{"score":{"name":"@p","objective":"kills"}},{"text":" kills"}]}
```
4. Click "解析" button

**Expected Result:**
- Modal closes
- Editor shows: "Player: [@p] has [@p:kills] kills"
- All tags are clickable and editable
- JSON output regenerates correctly

## Test Case 9: Conditional Block

**Steps:**
1. Clear the editor
2. Open decode modal
3. Paste:
```json
{"rawtext":[{"translate":"%%2","with":{"rawtext":[{"selector":"@p"},{"rawtext":[{"text":"Success!"}]}]}}]}
```
4. Click "解析" button

**Expected Result:**
- Modal closes
- A conditional tag appears showing "[IF selector THEN ...]"
- Clicking the tag opens the conditional editor
- JSON output is correct

## Test Case 10: XSS Safety (Security Test)

**Steps:**
1. Clear the editor
2. Open decode modal
3. Paste JSON with potential XSS payload:
```json
{"rawtext":[{"selector":"@p[name=\"<script>alert('xss')</script>\"]"}]}
```
4. Click "解析" button

**Expected Result:**
- Modal closes
- Selector tag is created and displays something like "[@p[name=\"<script>alert('xss')</script>\"]]"
- **No script alert appears** (this is the key security check)
- The value is stored as-is in the dataset (DOM property)
- The value can be correctly regenerated in JSON output
- No scripts execute because the app uses `textContent` and `dataset` API, not `innerHTML`

## Test Case 11: Regression - Normal Encoding Still Works

**Steps:**
1. Type some text in the editor manually
2. Insert a selector tag using the UI button
3. Verify JSON output generates correctly

**Expected Result:**
- All existing encode functionality works as before
- No regressions in normal workflow

## Automated Test

Run the automated tests by opening `test-decode.html` in a browser. All tests should show green checkmarks (✓).
