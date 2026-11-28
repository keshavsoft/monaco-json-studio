const emptyJsonText = '{}';

function createPane({ inPaneNumber }) {
    const localPaneNumber = inPaneNumber;
    const localPaneKey = `pane${localPaneNumber}`;
    const localFetchUrl = `./data/${localPaneKey}.json`;

    return {
        paneNumber: localPaneNumber,
        key: localPaneKey,
        label: `Pane ${localPaneNumber}`,
        header: {
            type: 'file-picker',
            fileBtnId: `openFileBtn${localPaneNumber}`,
            fileInputId: `fileInput${localPaneNumber}`,
            fetchUrlId: `fetchUrl${localPaneNumber}`,
            selectId: `paneSelect${localPaneNumber}`
        },
        body: {
            type: 'monaco',
            language: 'json',
            editorId: `editor${localPaneNumber}`,
            fetchUrl: localFetchUrl,
            contentText: emptyJsonText
        },
        footer: {
            type: 'none',
            cursorId: `paneCursor${localPaneNumber}`,
            text: ''
        },
        dataFiles: [{ fetchUrl: localFetchUrl, contentText: emptyJsonText }]
    };
}

export function createPanes({ inPaneCount }) {
    const localPaneCount = inPaneCount;

    return Array.from({ length: localPaneCount }, (_, index) => createPane({
        inPaneNumber: index + 1
    }));
}
