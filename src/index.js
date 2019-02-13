'use strict';
const _ = require('lodash');
const config = require('../config').config();
const rp = require('request-promise');

/*
get all tickets
find the vid from the most recent ticket
look up the contact by vid
get the contact name and email
 */

let _apiKey = '';

function updateTicketObjWithContact(options, ticketObj) {
  return rp(options).then(function(res) {
    const resJSON = JSON.parse(res);
    ticketObj.firstName = resJSON.properties.firstname.value;
    ticketObj.lastName = resJSON.properties.lastname.value;
    ticketObj.email = resJSON.properties.email.value;
    return ticketObj;
  });
}

function getContactByID(ticketObj) {
  const apiURL = `${config.baseURL}contacts/v1/contact/vid/${ticketObj.contactId}/profile?hapikey=${_apiKey}`;
  const options = {
    method: 'GET',
    uri: `${apiURL}`,
    rejectUnauthorized: config.rejectUnauthorized
  };
  return updateTicketObjWithContact(options, ticketObj);
}

function getAllContacts(apiKey) {
  _apiKey = apiKey;
  const apiURL = `${config.baseURL}contacts/v1/lists/all/contacts/all?hapikey=${apiKey}`;
  const options = {
    method: 'GET',
    uri: `${apiURL}`,
    rejectUnauthorized: config.rejectUnauthorized
  };
  return rp(options).then(function(res) {
    const hsContacts = [];
    const resJSON = JSON.parse(res);
    _.forEach(resJSON.contacts, function (obj) {
      const hsContact = {};
      hsContact.contactId = obj.vid;
      hsContact.firstName = obj.properties.firstname;
      hsContact.lastName = obj.properties.lastname;
      hsContact.email = obj['identity-profiles'][0].identities[0].value; // TODO: determine array index instead of assuming initial placement in each array
      hsContacts.push(hsContact);
    });
    return hsContacts;
  });
}

module.exports.getAllContacts = function(apiKey) {
  apiKey = apiKey;
  return getAllContacts();
};

module.exports.getAllTickets = function(apiKey) {
  _apiKey = apiKey;
  return getAllContacts(apiKey).then(function(hsContacts) {
    const apiURL = `${config.baseURL}crm-objects/v1/objects/tickets/paged?hapikey=${apiKey}&properties=subject&properties=content&properties=created_by`;
    const options = {
      method: 'GET',
      uri: `${apiURL}`,
      rejectUnauthorized: config.rejectUnauthorized
    };
    return rp(options).then(function(res) {
      const hsTickets = [];
      const resJSON = JSON.parse(res);
      _.forEach(resJSON.objects, function(obj) {
        const hsTicket = {};
        hsTicket.ticketId = obj.objectId;
        hsTicket.subject = obj.properties.subject.value;
        hsTicket.contactId = obj.properties.created_by.value;
        hsTicket.body = obj.properties.content.value;
        const matchedContact = _.find(hsContacts, function(contact) {
          return contact.contactId = hsTicket.contactId;
        });
        hsTicket.firstName = matchedContact.firstName;
        hsTicket.lastName = matchedContact.lastName;
        hsTicket.email = matchedContact.email;
        hsTickets.push(hsTicket);
      });

      return hsTickets;

    });
  });
};
