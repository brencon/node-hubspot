'use strict';
const _ = require('lodash');
const config = require('config');
const rp = require('request-promise');

/*
get all tickets
find the vid from the most recent ticket
look up the contact by vid
get the contact name and email
 */

module.exports.getAllTickets = function() {
  const apiURL = `${config.hubspot.baseURI}crm-objects/v1/objects/tickets/paged?hapikey=${config.hubspot.apikey}&properties=subject&properties=content&properties=created_by`;
  const options = {
    method: 'GET',
    uri: `${apiURL}`,
    rejectUnauthorized: config.rejectUnauthorized
  };
  return rp(options).then(function(res) {
    const hsTickets = [];
    const resJSON = JSON.parse(res);
    _.forEach(resJSON.objects, function(obj) {
      let hsTicket = {};

      hsTickets.push(hsTicket);
    });
    return hsTickets;
  });
};

/*
module.exports.searchByHashtag = function(hashtag) {
  const apiURL = `${config.instagram.baseURI}/${config.instagram.apiVersion}`;
  const options = {
    method: 'GET',
    uri: `${apiURL}/users/self/media/recent?access_token=${config.instagram.accessToken}`,
    rejectUnauthorized: config.rejectUnauthorized
  };
  return rp(options).then(function(res) {
    const matchedMedia = [];
    const resJSON = JSON.parse(res);
    _.forEach(resJSON.data, function(d) {
      if (d.tags.indexOf(hashtag) > -1)
        matchedMedia.push(d);

    });
    return { data: matchedMedia };
  });
};
*/