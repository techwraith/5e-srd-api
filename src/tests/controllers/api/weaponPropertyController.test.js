import { mockNext, mockRequest, mockResponse } from '../../support/requestHelpers.js';

import WeaponProperty from '../../../models/weaponProperty/index.js';
import WeaponPropertyController from '../../../controllers/api/weaponPropertyController.js';
import mockingoose from 'mockingoose';

let response;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'ammunition',
      name: 'Ammunition',
      url: '/api/weapon-properties/ammunition',
    },
    {
      index: 'finesse',
      name: 'Finesse',
      url: '/api/weapon-properties/finesse',
    },
    {
      index: 'heavy',
      name: 'Heavy',
      url: '/api/weapon-properties/heavy',
    },
  ];
  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    mockingoose(WeaponProperty).toReturn(findDoc, 'find');

    await WeaponPropertyController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(WeaponProperty).toReturn(error, 'find');

      await WeaponPropertyController.index(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'ammunition',
    name: 'Ammunition',
    url: '/api/weapon-properties/ammunition',
  };

  const showParams = { index: 'ammunition' };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(WeaponProperty).toReturn(findOneDoc, 'findOne');

    await WeaponPropertyController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(WeaponProperty).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await WeaponPropertyController.show(invalidRequest, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(WeaponProperty).toReturn(error, 'findOne');

      await WeaponPropertyController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
