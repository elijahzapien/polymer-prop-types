/**
 * Polymer property types
 */
'use strict';

const PropTypes = require('prop-types');

// TODO:
// Add `subclass._propertiesChanged` check. If missing add
// Polymer.PropertyAccesors mixin before returning.
module.exports = subclass => class extends subclass {
  constructor() {
    super();

    /** @type {!Object} */
    this.__PolymerPropTypes = {
      serializedAttributes: {}
    };
  }

  attributeChangedCallback(name, old, value) {
    // TODO:
    // Add `toCamelCase` lodash method when adding attribute name.
    // Attributes are dashed. Ideally should be camel case.

    super.attributeChangedCallback(name, old, value);

    if (old !== value) {
      this.__PolymerPropTypes.serializedAttributes[name] = value;
    }
  }

  /**
   * `Polymer.PropertyAccessors` mixin callback called when any properties
   * with accessors created via `_createPropertyAccessor` have been set.
   *
   * @param {!Object} currentProps Bag of all current accessor values
   * @param {!Object} changedProps Bag of properties changed since the last
   *   call to `_propertiesChanged`
   * @param {!Object} oldProps Bag of previous values for each property
   *   in `changedProps`
   * @protected
   */
  _propertiesChanged(currentProps, changedProps, oldProps) {
    super._propertiesChanged(currentProps, changedProps, oldProps);

    const deserializeTypes = this
      ._computeDeserializeTypes(this.constructor.properties);
    const types = this.constructor.propTypes;
    const values = this._formatValues(deserializeTypes, currentProps);
    const name = this.constructor.is;

    PropTypes.checkPropTypes(
      types,
      values,
      'props',
      name
    );
  }

  /**
   * Computes the `Polymer.PropertyAccessors` defined deserialize types.
   *
   * @param {!Object} types `Polymer.PropertyAccessors` defined
   *    deserialze types.
   * @return {Object} The deserialize types.
   * @protected
   */
  _computeDeserializeTypes(types = {}) {
    let computed = Object.assign({}, types);

    for (const prop in computed) {
      try {
        computed[prop] = computed[prop].name;
      } catch(x) {
        // Keep current value.
      }
    }

    return computed;
  }

  /**
   * Formats property values based on their defined deserialize types to be
   * used in PropTypes check.
   *
   * @param {!Object} types `Polymer.PropertyAccessors` defined
   *    deserialze types.
   * @param {!Object} props All properties.
   * @return {Object} The formatted properties.
   * @protected
   */
  _formatValues(deserializeTypes = {}, props = {}) {
    let formatted = Object.assign({}, props);

    for (const prop in formatted) {
      const deserializeType = deserializeTypes[prop];
      const value = formatted[prop];

      // Manually parse Polymer properties with deserialize type of 'Number'.
      // Polymer uses Number() for deserialization resulting in 'NaN'
      // which gives misleading prop-type check.
      if (
        deserializeType === 'Number' &&
        isNaN(value) &&
        value !== value
      ) {
        const serializedValue = this.__PolymerPropTypes
          .serializedAttributes[prop];

        try {
          formatted[prop] = JSON.parse(serializedValue);
        } catch(x) {
          formatted[prop] = serializedValue;
        }
      }
    }

    return formatted;
  }
};
