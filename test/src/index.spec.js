'use strict';

var expect = require('chai').expect;
var nodeHubSpot = require('../../index');

describe('node-hubspot', function() {
  it('works', function() {
    nodeHubSpot.getAllTickets('yourkeygoesherelol').then(function(res) {
      const hsData = res;
      expect(hsData).to.be.an('array').that.is.not.empty;
    });
  });
});