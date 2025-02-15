import * as MagicItemController from '../../../controllers/api/magicItemController.js';

import { mockNext, mockRequest, mockResponse } from '../../support/requestHelpers.js';

import MagicItem from '../../../models/magicItem/index.js';
import mockingoose from 'mockingoose';

let response;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'adamantine-armor',
      name: 'Adamantine Armor',
      url: '/api/magic-items/adamantine-armor',
    },
    {
      index: 'ammunition',
      name: 'Ammunition, +1, +2, or +3',
      url: '/api/magic-items/ammunition',
    },
    {
      index: 'amulet-of-health',
      name: 'Amulet of Health',
      url: '/api/magic-items/amulet-of-health',
    },
  ];
  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    mockingoose(MagicItem).toReturn(findDoc, 'find');

    await MagicItemController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(MagicItem).toReturn(error, 'find');

      await MagicItemController.index(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'adamantine-armor',
    name: 'Adamantine Armor',
    url: '/api/magic-items/adamantine-armor',
  };

  const showParams = { index: 'adamantine-armor' };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(MagicItem).toReturn(findOneDoc, 'findOne');

    await MagicItemController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(MagicItem).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await MagicItemController.show(invalidRequest, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(MagicItem).toReturn(error, 'findOne');

      await MagicItemController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
