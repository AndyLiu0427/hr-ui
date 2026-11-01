import { Directive } from '@angular/core';

// Markers, not behaviour: the panel reads each one with contentChild(_, { read: TemplateRef }),
// so the class is only a token. The ng-template selector stops the attribute landing on an
// element that has no TemplateRef to read.

/** Rendered for every result row. Context: `$implicit` item, `query`, `selected`. */
@Directive({ selector: 'ng-template[octSearchPanelRow]' })
export class SearchPanelRowDirective {}

/** Shown whenever there are no results. Context: `$implicit` query, so one template serves idle and no-results. */
@Directive({ selector: 'ng-template[octSearchPanelEmpty]' })
export class SearchPanelEmptyDirective {}
