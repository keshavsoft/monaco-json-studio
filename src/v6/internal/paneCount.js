function validatePaneCount(value) {
    if (!Number.isInteger(value) || value < 1 || value > 3) {
        throw new Error(`Pane count must be 1, 2, or 3. Received: ${String(value)}`);
    }
    return value;
}

export { validatePaneCount };
