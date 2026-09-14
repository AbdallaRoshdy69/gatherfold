# Accessibility contract

Gatherfold treats keyboard and screen-reader behavior as part of the editor's public interaction contract.

## Focus behavior

- Opening **Add signature** moves focus to the signature label.
- `Tab` and `Shift+Tab` cycle within the modal while it is open.
- `Escape`, **Cancel**, and the close button dismiss the modal.
- Closing the modal returns focus to the control that opened it.
- Every page slot is a native button with a pressed state for the current selection.

## Status communication

- Slot changes, page location, book switches, and history actions publish a polite live-region announcement.
- Missing, repeated, and out-of-range assignments are rendered as text lists.
- Proof status is expressed in button text and status copy, not only by color.
- Invalid page searches use an alert linked to the numeric input with `aria-describedby`.

## Keyboard commands

| Command | Result |
| --- | --- |
| `Ctrl/Command + Z` | Undo the latest model change |
| `Ctrl/Command + Shift + Z` | Redo the latest undone change |
| `Ctrl/Command + Y` | Redo on platforms that use the alternate convention |
| `Escape` | Close the signature dialog |

Global history shortcuts are deliberately ignored while an input, textarea, or select has focus so native text editing remains intact.

## Manual review checklist

1. Traverse the workbench using only `Tab`, `Shift+Tab`, `Enter`, and `Space`.
2. Open and close the signature dialog from the keyboard and confirm focus restoration.
3. Create a duplicate page assignment and verify the affected slots and textual preflight list agree.
4. Switch books, return, and verify the previously selected page is restored.
5. Check the compact layout at narrow widths and at 200% browser zoom.
