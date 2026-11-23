export const paneConfigs = [
  {
    "paneNumber": 1,
    "label": "Instructions",
    "fileName": "instructions.json",
    "headerType": "file-picker",
    "bodyType": "monaco",
    "language": "json",
    "footerType": "cursor"
  },
  {
    "paneNumber": 2,
    "label": "Data",
    "fileName": "data.json",
    "headerType": "file-picker",
    "bodyType": "monaco",
    "language": "json",
    "footerType": "note"
  },
  {
    "paneNumber": 3,
    "label": "Output",
    "fileName": "columns.json",
    "headerType": "title",
    "bodyType": "monaco",
    "language": "json",
    "footerType": "none"
  }
];
export const state = { editors: [], contents: [] };
