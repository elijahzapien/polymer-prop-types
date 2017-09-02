# polymer-prop-types
Runtime type checking for Polymer properties

## Installation

### NPM

```shell
npm install --save polymer-prop-types
```

### Bower

```shell
bower install --save polymer-prop-types
```

## Importing

### NPM

```js
import { propTypeValidation } from 'polymer-prop-types'; // ES6

var propTypeValidation = require('polymer-prop-types').propTypeValidation; // ES5
```

### Bower

```html
<link rel="import" href="../bower_components/polymer-prop-types/polymer-prop-types.html">
```

## Usage

### NPM

```js
import PropTypes from 'prop-types';
import { propTypeValidation } from 'polymer-prop-types';

class MyElement extends propTypeValidation(Polymer.Element) {
  static get is() {
    return 'my-element';
  }

  static get properties() {
    return {
      users: Array
    };
  }

  static get propTypes() {
    return {
      users: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string,
        age: PropTypes.number,
        bio: PropTypes.string
      }))
    };
  }
}

window.customElements.define(MyElement.is, MyElement);
```

### Bower
If you prefer Bower, you can import and get it from `window.PolymerPropTypes` global:

```html
<link rel="import" href="../bower_components/polymer-prop-types/polymer-prop-types.html">

<script>
  (function () {
    class MyElement extends PolymerPropTypes.propTypeValidation(Polymer.Element) {
      static get is() {
        return 'my-element';
      }

      static get properties() {
        return {
          users: Array
        };
      }

      static get propTypes() {
        return {
          users: PolymerPropTypes.PropTypes.arrayOf(PolymerPropTypes.PropTypes.shape({
            id: PolymerPropTypes.PropTypes.number.isRequired,
            name: PolymerPropTypes.PropTypes.string,
            age: PolymerPropTypes.PropTypes.number,
            bio: PolymerPropTypes.PropTypes.string
          }))
        };
      }
    }

    window.customElements.define(MyElement.is, MyElement);
  })();
</script>
```
