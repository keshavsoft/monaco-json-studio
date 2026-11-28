const paneProfiles = [
    {
        key: 'instructions',
        label: 'Instructions',
        fileName: 'instructions.json',
        headerType: 'file-picker',
        bodyType: 'monaco',
        language: 'json',
        footerType: 'cursor'
    },
    {
        key: 'data',
        label: 'Data',
        fileName: 'data.json',
        headerType: 'file-picker',
        bodyType: 'monaco',
        language: 'json',
        footerType: 'note',
        footerText: 'Source data • editable JSON'
    },
    {
        key: 'output',
        label: 'Output',
        fileName: 'columns.json',
        headerType: 'title',
        bodyType: 'monaco',
        language: 'json',
        footerType: 'none'
    }
];

function getPaneProfiles(paneCount) {
    return paneProfiles.slice(0, paneCount).map((profile) => ({ ...profile }));
}

export { getPaneProfiles };
