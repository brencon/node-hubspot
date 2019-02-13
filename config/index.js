module.exports.config = function() {
  const configObj = {};
  configObj.rejectUnauthorized = false;
  configObj.baseURL = 'https://api.hubapi.com/';
  configObj.throttleInSeconds = 10;
  return configObj;
};
