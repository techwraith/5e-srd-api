import AbilityScoreModel from '../../models/abilityScore/index.js';
import LanguageModel from '../../models/language/index.js';
import ProficiencyModel from '../../models/proficiency/index.js';
import SubraceModel from '../../models/subrace/index.js';
import TraitModel from '../../models/trait/index.js';
import { coalesceFilters, resolveChoice, resolveContainsStringFilter } from './common.js';

const Race = {
  ability_bonuses: async race => {
    const abilityBonuses = race.ability_bonuses;
    const abilityScores = await AbilityScoreModel.find({
      index: { $in: abilityBonuses.map(ab => ab.ability_score.index) },
    }).lean();

    return abilityBonuses.map(ab => ({
      ...ab,
      ability_score: abilityScores.find(as => as.index === ab.ability_score.index),
    }));
  },
  languages: async (race, args) => {
    const filters = [{ index: { $in: race.languages.map(l => l.index) } }];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await LanguageModel.find(coalesceFilters(filters)).lean();
  },
  size: race => race.size.toUpperCase(),
  starting_proficiencies: async (race, args) => {
    const filters = [
      {
        index: { $in: race.starting_proficiencies.map(p => p.index) },
      },
    ];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await ProficiencyModel.find(coalesceFilters(filters)).lean();
  },
  subraces: async (race, args) => {
    const filters = [{ index: { $in: race.subraces.map(s => s.index) } }];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await SubraceModel.find(coalesceFilters(filters)).lean();
  },
  traits: async (race, args) => {
    const filters = [{ index: { $in: race.traits.map(t => t.index) } }];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await TraitModel.find(coalesceFilters(filters)).lean();
  },
  ability_bonus_options: async race => {
    if (!race.ability_bonus_options) {
      return null;
    }

    return resolveChoice(race.ability_bonus_options, {
      options: race.ability_bonus_options.from.options.map(async option => ({
        ...option,
        ability_score: await AbilityScoreModel.findOne({ index: option.ability_score.index }),
      })),
    });
  },
  language_options: async race => {
    if (!race.language_options) {
      return null;
    }

    return resolveChoice(race.language_options, {
      options: race.language_options.from.options.map(async option => ({
        ...option,
        item: await LanguageModel.findOne({ index: option.item.index }).lean(),
      })),
    });
  },
  starting_proficiency_options: async race => {
    if (!race.starting_proficiency_options) {
      return null;
    }

    return resolveChoice(race.starting_proficiency_options, {
      options: race.starting_proficiency_options.from.options.map(async option => ({
        ...option,
        item: await ProficiencyModel.findOne({ index: option.item.index }).lean(),
      })),
    });
  },
};

export default Race;
