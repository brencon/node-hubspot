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

let _apiKey = '';

function getContactByID(ticketObj) {
  const apiURL = `${config.hubspot.baseURI}contacts/v1/contact/vid/${ticketObj.contactId}/profile?hapikey=${_apiKey}`;
  const options = {
    method: 'GET',
    uri: `${apiURL}`,
    rejectUnauthorized: config.rejectUnauthorized
  };
  return rp(options).then(function(res) {
    const resJSON = JSON.parse(res);
    ticketObj.firstName = resJSON.properties.firstname.value;
    ticketObj.lastName = resJSON.properties.lastname.value;
    ticketObj.email = resJSON.properties.email.value;
    return ticketObj;
  });
}

module.exports.getAllTickets = function(apiKey) {
  _apiKey = apiKey;
  const apiURL = `${config.hubspot.baseURI}crm-objects/v1/objects/tickets/paged?hapikey=${apiKey}&properties=subject&properties=content&properties=created_by`;
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
      hsTicket.subject = obj.properties.subject.value;
      hsTicket.contactId = obj.properties.created_by.value;
      hsTicket.body = obj.properties.content.value;
      hsTickets.push(hsTicket);
    });

    const actions = hsTickets.map(getContactByID);

    const results = Promise.all(actions);

    return results.then(function(hsTicketsWithContact) {
      return hsTicketsWithContact;
    });

  });
};
