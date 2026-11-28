export function validatePaneCount(inPaneCount) {
    if (!Number.isInteger(inPaneCount) || ![1, 2, 3].includes(inPaneCount)) {
        throw new TypeError('paneCount must be 1, 2, or 3.');
    }

    return inPaneCount;
}

export function validateFolderName(inFolderName) {
    if (typeof inFolderName !== 'string' || inFolderName.trim() === '') {
        throw new TypeError('folderName must be a non-empty string.');
    }

    return inFolderName;
}
