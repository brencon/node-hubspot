'use strict';
const _ = require('lodash');
const config = require('config');
const rp = require('request-promise');

console.log('src/index.js');

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