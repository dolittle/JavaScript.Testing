// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { BrokenRule } from '@dolittle/rules';
import { ScenarioWithThenSubject } from './rules';
import { Specification, ISpecificationRunner, ScenarioContext, ScenarioFor, SpecificationResult, ThenResult, RuleSetEvaluatorForContext } from './index';

export class SpecificationRunner implements ISpecificationRunner {
    async run(scenarioFor: ScenarioFor<ScenarioContext>, specification: Specification): Promise<SpecificationResult> {
        for (const given of specification.givens) {
            await given.invoke(scenarioFor);
        }

        await specification.when.invoke(scenarioFor);

        for (const and of specification.ands) {
            await and.invoke(scenarioFor);
        }

        for (const then of specification.thens) {
            await then.invoke(scenarioFor);
        }

        const thenResults: ThenResult[] = await this.collectResultsFor(scenarioFor, specification);

        return new SpecificationResult(specification, thenResults);
    }

    private async collectResultsFor(scenarioFor: ScenarioFor<ScenarioContext>, specification: Specification) {
        const thenResults: ThenResult[] = [];
        if (scenarioFor.context != null) {
            const brokenRulesByThens: {
                [key: string]: BrokenRule[];
            } = {};
            const brokenRules = await RuleSetEvaluatorForContext.getFor(scenarioFor.context).evaluate();
            for (const brokenRule of brokenRules) {
                const subject = brokenRule.subject as ScenarioWithThenSubject;
                let brokenRulesForThen: BrokenRule[];
                if (brokenRulesByThens.hasOwnProperty(subject.then)) {
                    brokenRulesForThen = brokenRulesByThens[subject.then];
                } else {
                    brokenRulesForThen = [];
                    brokenRulesByThens[subject.then] = brokenRulesForThen;
                }
                brokenRulesForThen.push(brokenRule);
            }

            for (const then of specification.thens) {
                let brokenRules: BrokenRule[] = [];
                if (brokenRulesByThens.hasOwnProperty(then.name)) {
                    brokenRules = brokenRulesByThens[then.name];
                }
                const result = new ThenResult(then, brokenRules);
                thenResults.push(result);
            }
        }
        return thenResults;
    }
}
