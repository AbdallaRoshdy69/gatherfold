# Imposition model

A Gatherfold sheet carries two page positions on its front and two on its back. A folded four-page sheet pairs the highest remaining page with the lowest on the front, then the next-lowest with the next-highest on the back.

For a 16-page signature beginning at page 1:

| Sheet | Front | Back |
| --- | --- | --- |
| 1 · outer forme | 16 · 1 | 2 · 15 |
| 2 | 14 · 3 | 4 · 13 |
| 3 | 12 · 5 | 6 · 11 |
| 4 · centre fold | 10 · 7 | 8 · 9 |

`imposePages` accepts a positive starting page and a page count divisible by four. IDs incorporate the signature ID and sheet position so the UI can retain physical identity while sheets move.

`analyzeBook` flattens every front and back slot, counts valid occurrences, and returns three independent findings:

- expected pages with no assignment;
- expected pages assigned more than once;
- non-integer or out-of-range assignments.

A book is press-ready only when all three collections are empty.
