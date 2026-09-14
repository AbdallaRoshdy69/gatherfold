# Testing strategy

The verification suite runs sequentially in jsdom and replaces `localStorage` with an in-memory implementation before every test.

Pure model tests cover exact page pairs, offset signatures, invalid inputs, helper calculations, duplicate and missing detection, out-of-range slots, immutable edits, boundary moves, undo/redo stacks, proof state, notes, and book extension.

Interaction tests cover project switching, side isolation, page correction, visible conflict feedback, undo/redo, page finding across signatures, physical sheet moves, proof status, and adding an imposed signature. Queries use roles, names, labels, and user-visible text instead of implementation details.
