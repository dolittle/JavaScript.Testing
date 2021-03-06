// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Specification, ThenResult } from './index';

export class SpecificationResult {
    constructor(readonly specification: Specification, readonly results: ThenResult[]) {
    }
}
