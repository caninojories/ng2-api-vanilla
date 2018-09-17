'use strict';

const util = require('util');
const copy = util._extend;

/**
 * @author Jo-Ries Canino
 * @description It append and copies configuration
 */

/**
 * @param {object} proto - config to append
 * @param {object} overwrites - config to overwrites
 * @param {object} append - config to append
 */
function deepCopy(proto, overwrites, append) {
  // We can't deep copy things like Bunyan log instances.
  if (overwrites.constructor !== Object) {
    return overwrites;
  }

  if (append) {
    return deepCopyAppend(proto, overwrites);
  }

  let defaults = copy({}, proto);
  if (!defaults) defaults = {};

  for (let prop in overwrites) {
    if (!util.isPrimitive(overwrites[prop])) {
      if (!Array.isArray(overwrites[prop])) {
        overwrites[prop] = deepCopy(defaults[prop], overwrites[prop]);
      }
    }
    defaults[prop] = overwrites[prop];
  }
  return defaults;
}

/**
 * @param {object} proto - config to append
 * @param {object} overwrites - config to overwrites
 * @param {object} append - config to append
 */
function deepCopyAppend(proto, overwrites) {
  let defaults = copy({}, proto);
  if (!defaults) defaults = {};

  for (let prop in overwrites) {
    if (!util.isPrimitive(overwrites[prop])) {
      if (Array.isArray(overwrites[prop])) {
        if (!Array.isArray(defaults[prop])) {// eslint-disable-line max-depth
          defaults[prop] = [];
        }
        overwrites[prop] = defaults[prop].concat(overwrites[prop]);
      } else {
        overwrites[prop] = deepCopyAppend(defaults[prop], overwrites[prop]);
      }
    }
    defaults[prop] = overwrites[prop];
  }

  return defaults;
}

module.exports = deepCopy;
