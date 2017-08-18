/**
 * CEPropTypes Mixin.
 */

const PropTypes = require('prop-types');

(function () {
  window.PolymerPropTypes = {};

  PolymerPropTypes.PropTypes = PropTypes;

  PolymerPropTypes.propertyValidation = subclass => class extends subclass {
    constructor() {
      super();

      /** @type {!Object} */
      this.__CEPropTypes = {
        serializedAttributes: {}
      };
    }

    attributeChangedCallback(name, old, value) {
      super.attributeChangedCallback(name, old, value);

      if (old !== value) {
        this.__CEPropTypes.serializedAttributes[name] = value;
      }
    }

    _propertiesChanged(currentProps, changedProps, oldProps) {
      super._propertiesChanged(currentProps, changedProps, oldProps);

      const types = this.constructor.propTypes;
      const friendlyValues = this._friendlyFormat(types, currentProps);
      const name = this.constructor.is;

      PolymerPropTypes.PropTypes.checkPropTypes(
        types,
        friendlyValues,
        'props',
        name
      );
    }

    _friendlyFormat(types, values) {
      let formatted = Object.assign({}, values);

      for (const prop in formatted) {
        const value = formatted[prop];

        /*
         * Manually check Polymer property defined as 'Number'.
         * Polymer uses Number() for deserialization resulting in 'NaN'
         * which gives misleading type comparison.
         */
        if (isNaN(value) && value !== value) {
          const serialized = this.__CEPropTypes.serializedAttributes[prop];

          try {
            formatted[prop] = JSON.parse(serialized);
          } catch (x) {
            formatted[prop] = serialized;
          }
        }
      }

      return formatted;
    }
  };
})();