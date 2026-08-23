// Bare `data-section` label -> status-bar display string. Matches
// Portfolio v2.dc.html's SECTIONS array. The bare labels are shared with
// Header's NAV entries, so both the status bar and the header's scroll-driven
// active tab read off the same `[data-section]` markers.
export const SECTIONS: [string, string][] = [
  ['about', '01 about'],
  ['skills', '02 capabilities'],
  ['experience', '03 experience'],
  ['work', '04 selected work'],
  ['education', '06 education'],
  ['contact', '07 contact'],
];

export const DEFAULT_SECTION_DISPLAY = '00 index';
