// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Given, FeatureDefinition, BecauseOf, Then } from './index';

export class Specification {
    static empty: Specification = {
        feature: FeatureDefinition.unspecified,
        givens: [],
        when: BecauseOf.nothing,
        ands: [],
        thens: [],
        children: []
    };

    readonly feature!: FeatureDefinition;
    readonly givens!: Given[];
    readonly when!: BecauseOf;
    readonly ands!: BecauseOf[];
    readonly thens!: Then[];
    readonly children: Specification[] = [];
}
