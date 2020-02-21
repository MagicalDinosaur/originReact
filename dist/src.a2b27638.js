// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/react-dom/dom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAttribute = setAttribute;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * 给dom渲染属性
 */
function setAttribute(dom, name, value) {
  // className => class
  if (name === 'className') name = 'class'; // 事件 onXXX

  if (/on\w+/.test(name)) {
    name = name.toLowerCase();
    dom[name] = value || '';
  } // style 
  else if (name === 'style') {
      if (!value || typeof value === 'string') {
        dom.style.cssText = value || '';
      } else if (value && _typeof(value) === 'object') {
        for (var _name in value) {
          // 可以通过style={ width: 20 }这种形式来设置样式，可以省略掉单位px
          dom.style[_name] = typeof value[_name] === 'number' ? value[_name] + 'px' : value[_name];
        }
      }
    } // 其他
    else {
        if (name in dom) {
          dom[name] = value || '';
        }

        if (value) {
          dom.setAttribute(name, value);
        } else {
          dom.removeAttribute(name);
        }
      }
}
},{}],"src/react-dom/diff.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diff = diff;
exports.diffNode = diffNode;
exports.setComponentProps = setComponentProps;
exports.renderComponent = renderComponent;
exports.createComponent = createComponent;

var _dom = require("./dom");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * @param {HTMLElement} dom 真实DOM
 * @param {vnode} vnode 虚拟DOM
 * @param {HTMLElement} container 容器
 * @returns {HTMLElement} 更新后的DOM
 */
function diff(dom, vnode, container) {
  var ret = diffNode(dom, vnode);

  if (container && ret.parentNode !== container) {
    container.appendChild(ret);
  }

  return ret;
}
/**
 * 
 * @param {HTMLElement} dom 真实DOM
 * @param {*} vnode 虚拟DOM
 * @returns {HTMLElement} 更新后的DOM
 */


function diffNode(dom, vnode) {
  var newDom = dom;
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = '';
  if (typeof vnode === 'number') vnode = String(vnode); // vnode 是文本的情况

  if (typeof vnode === 'string') {
    // 如果 dom 也是文本
    if (dom && dom.nodeType === 3) {
      if (dom.textContent !== vnode) {
        dom.textContent = vnode;
      }
    } // 如果 dom 不是文本，说明前后不一致，直接进行替换
    else {
        newDom = document.createTextNode(vnode);

        if (dom && dom.parentNode) {
          dom.parentNode.replaceChild(parentNode);
        }
      }

    return newDom;
  } // vnode 是组件的情况


  if (typeof vnode.tag === 'function') {
    return diffComponent(dom, vnode);
  } // 如果原来的 dom 不存在 或者两者标签节点类型不一样时


  if (!dom || !isSameNodeType(dom, vnode)) {
    newDom = document.createElement(vnode.tag);

    if (dom) {
      _toConsumableArray(dom.childNodes).map(newDom.appendChild); // 将原来的子节点移到新节点下


      if (dom.parentNode) {
        dom.parentNode.replaceChild(newDom, dom); // 移除掉原来的DOM对象
      }
    }
  } // 进行 child 的对比


  if (vnode.children && vnode.children.length > 0 || newDom.childNodes && newDom.childNodes.length > 0) {
    diffChildren(newDom, vnode.children);
  } // 进行属性的对比


  diffAttributes(newDom, vnode);
  return newDom;
}
/**
 * 
 * @param {HTMLElement} dom 真实DOM
 * @param {Array} vchildren 虚拟 dom 的 children
 */


function diffChildren(dom, vchildren) {
  var domChildren = dom.childNodes;
  var children = []; // 存放没有key标记的 old child

  var keyed = {}; // 进行标记 key: child 
  // 将有key的节点和没有key的节点分开

  if (domChildren.length > 0) {
    for (var i = 0; i < domChildren.length; i++) {
      var child = domChildren[i];
      var key = child.key;

      if (key) {
        keyed[key] = child;
      } else {
        children.push(child);
      }
    }
  }

  if (vchildren && vchildren.length > 0) {
    var min = 0;
    var childrenLen = children.length;

    for (var _i = 0; _i < vchildren.length; _i++) {
      var vchild = vchildren[_i];
      var _key = vchild.key;

      var _child = void 0; // 输出的child
      // 如果当前child有key去匹配


      if (_key) {
        if (keyed[_key]) {
          _child = keyed[_key];
          keyed[_key] = undefined;
        }
      } // 如果没有key标记，则优先找类型相同的节点
      else if (min < childrenLen) {
          for (var j = min; j < childrenLen; j++) {
            var c = children[j];

            if (c && isSameNodeType(c, vchild)) {
              _child = c;
              children[j] = undefined;
              if (j === childrenLen - 1) childrenLen--;
              if (j === min) min++;
              break;
            }
          }
        } // 对比DOM


      _child = diff(_child, vchild); // 更新DOM

      var f = domChildren[_i];

      if (_child && _child !== dom && _child !== f) {
        // 如果更新前的对应位置为空，说明此节点是新增的
        if (!f) {
          dom.appendChild(_child);
        } // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
        else if (_child === f.nextSibling) {
            removeNode(f);
          } // 将更新后的节点移动到正确的位置
          else {
              // 注意insertBefore的用法，第一个参数是要插入的节点，第二个参数是已存在的节点
              dom.insertBefore(_child, f);
            }
      }
    }
  }
}
/**
 * 组件对比
 * @param {HTMLElement} dom 真实DOM
 * @param {Array} vchildren 虚拟 dom 的 children
 */


function diffComponent(dom, vnode) {
  var c = dom && dom._component;
  var oldDom = dom; // 如果组件类型没有变化，则重新set props

  if (c && c.constructor === vnode.tag) {
    setComponentProps(c, vnode.attrs);
    dom = c.base;
  } // 如果组件类型变化，则移除掉原来组件，并渲染新的组件
  else {
      if (c) {
        unmountComponent(c);
        oldDom = null;
      }

      c = createComponent(vnode.tag, vnode.attrs);
      setComponentProps(c, vnode.attrs);
      dom = c.base;

      if (oldDom && dom !== oldDom) {
        oldDom._component = null;
        removeNode(oldDom);
      }
    }

  return dom;
}
/**
 * 对节点进行属性进行diff判断
 * @param {HTMLElement} dom 真实DOM
 * @param {*} vnode 虚拟DOM
 */


function diffAttributes(dom, vnode) {
  var oldAttrs = {};
  var newAttrs = vnode.attrs;

  for (var i = 0; i < dom.attributes.length; i++) {
    var attr = dom.attributes[i];
    oldAttrs[attr.name] = attr.value;
  }

  for (var name in oldAttrs) {
    // 如果原来的属性不在新的里面了，则将属性值设置为 undefined，将其移除掉
    if (!(name in newAttrs)) {
      (0, _dom.setAttribute)(dom, name, undefined);
    }
  } // 更新 dom 的所有值变化的属性


  for (var _name in newAttrs) {
    if (oldAttrs[_name] !== newAttrs[_name]) {
      (0, _dom.setAttribute)(dom, _name, newAttrs[_name]);
    }
  }
}
/**
 * 用来更新 props
 * 生命周期：componentWillMount、componentWillReceiveProps
 */


function setComponentProps(component, props) {
  if (!component.base) {
    if (component.componentWillMount) component.componentWillMount();
  } else if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props);
  } // component.props = props;


  renderComponent(component);
}
/**
 * 渲染组件
 * setState的时候会调用
 * 先 render() 拿到vnode 再 _render() 拿到 dom
 * 生命周期：componentWillUpdate，componentDidUpdate，componentDidMount
 */


function renderComponent(component) {
  var base;
  var renderer = component.render(); // 拿到 vnode

  if (component.base && component.componentWillUpdate) {
    component.componentWillUpdate();
  }

  base = diff(component.base, renderer); // component.base = base;
  // base._component = component;

  if (component.base) {
    if (component.componentDidUpdate) component.componentDidUpdate();
  } else if (component.componentDidMount) {
    component.base = base;
    component.componentDidMount();
  }

  component.base = base; // 保存组件的 dom 对象

  base._component = component; // dom 对象对应的组件
}
/**
 * 实例化组件
 */


function createComponent(component, props) {
  var inst; // 如果是类定义组件，则直接返回实例,否则 new 一个组件实例

  if (component.prototype && component.prototype.render) {
    inst = new component(props); // 如果是函数定义组件，则将其扩展为类定义组件
  } else {
    inst = new ReactComponent(props);
    inst.constructor = component;

    inst.render = function () {
      return this.constructor(props);
    };
  }

  return inst;
}
/**
 * NodeType 对比
 * @param {HTMLElement} dom 真实DOM
 * @param {*} vnode 虚拟DOM
 */


function isSameNodeType(dom, vnode) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return dom.nodeType === 3;
  }

  if (typeof vnode.tag === 'string') {
    return dom.nodeName.toLowerCase() === vnode.tag.toLowerCase();
  }

  return dom && dom._component && dom._component.constructor === vnode.tag;
}

function unmountComponent(component) {
  if (component.componentWillUnmount) component.componentWillUnmount();
  removeNode(component.base);
}

function removeNode(dom) {
  if (dom && dom.parentNode) {
    dom.parentNode.removeChild(dom);
  }
}
},{"./dom":"src/react-dom/dom.js"}],"src/react/component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Component = void 0;

var _diff = require("../react-dom/diff");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * React.Component
 * 组件的 Component 类
 */
var Component =
/*#__PURE__*/
function () {
  function Component() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Component);

    // 初始化 state 和 props
    this.state = {};
    this.props = props;
  } // setState 触发视图渲染


  _createClass(Component, [{
    key: "setState",
    value: function setState(newData) {
      Object.assign(this.state, newData);
      (0, _diff.renderComponent)(this);
    }
  }]);

  return Component;
}();

exports.Component = Component;
var _default = Component;
exports.default = _default;
},{"../react-dom/diff":"src/react-dom/diff.js"}],"src/react/create-element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _component = _interopRequireDefault(require("./component.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * React.createElement()
 * transform-react-jsx 是 jsx 转换成 js 的babel 插件
 * 他有一个 pramgma 项，来定义转换 jsx 的方法名称
 * 这里我定义这个函数为 createElement
 */
function createElement(tag) {
  var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return {
    tag: tag,
    attrs: attrs,
    children: children // key: attrs.key || null

  };
}

;
var _default = createElement;
exports.default = _default;
},{"./component.js":"src/react/component.js"}],"src/react/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _component = _interopRequireDefault(require("./component.js"));

var _createElement = _interopRequireDefault(require("./create-element.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  Component: _component.default,
  createElement: _createElement.default
};
exports.default = _default;
},{"./component.js":"src/react/component.js","./create-element.js":"src/react/create-element.js"}],"src/react-dom/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _diff = require("./diff");

/**
 * 
 * vNode有三种结构：
 * 1.原生DOM节点的vnode
 * {
 *     tag: 'div',
 *     attrs: {
 *         className: 'container'
 *     },
 *     children: []
 * }
 * 
 * 2.文本节点的vnode
 * "hello,world"
 * 
 * 3.组件的vnode
 * {
 *     tag: ComponentConstrucotr,
 *     attrs: {
 *         className: 'container'
 *     },
 *     children: []
 * }
 */
function _render(vnode) {
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = '';
  if (typeof vnode === 'number' || vnode instanceof Date) vnode = String(vnode); // 如果是纯文本

  if (typeof vnode === 'string') {
    var textNode = document.createTextNode(vnode);
    return container.appendChild(textNode);
  } // 如果 vnode 是组件时的处理,组件的tag是一个构造函数


  if (typeof vnode.tag === 'function') {
    // const component = createComponent(vnode.tag, vnode.attrs);
    // setComponentProps(component, vnode.attrs);
    // return component.base;
    var component = vnode;

    if (component._container) {
      if (component.componentWillUpdate) {
        component.componentWillUpdate();
      }
    } else if (component.componentWillMount) {
      component.componentWillMount();
    }

    component._container = container; // 保存父容器信息，用于更新

    vnode = component.render();
  }

  var dom = document.createElement(vnode.tag); // 挂载属性

  if (vnode.attrs) {
    Object.keys(vnode.attrs).forEach(function (key) {
      var value = vnode.attrs[key];
      if (key === 'className') key = 'class'; // 如果是事件监听函数，则直接附加到dom上

      if (typeof value === 'function') {
        dom[key.toLowerCase()] = value;
      } else {
        dom.setAttribute(key, vnode.attrs[key]);
      }
    });
  } // 递归子元素


  vnode.children && vnode.children.forEach(function (child) {
    return _render(child, dom);
  }); // 递归渲染子节点

  return container.appendChild(dom);
}
/**
 * React.render()
 * render方法的作用是将虚拟DOM渲染成真实的DOM
 */


function render(vnode, container, dom) {
  console.log(container, vnode, container);
  return (0, _diff.diff)(dom, vnode, container);
}

var _default = render;
exports.default = _default;
},{"./diff":"src/react-dom/diff.js"}],"src/react-dom/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _render = _interopRequireDefault(require("./render"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  render: _render.default
};
exports.default = _default;
},{"./render":"src/react-dom/render.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

var _react = _interopRequireDefault(require("./react"));

var _reactDom = _interopRequireDefault(require("./react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var App =
/*#__PURE__*/
function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    var _this;

    _classCallCheck(this, App);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(App).call(this));
    _this.state = {
      num: 0
    };
    return _this;
  }

  _createClass(App, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      console.log('666');

      for (var i = 0; i < 10; i++) {
        this.setState({
          num: this.state.num + 1
        });
        console.log(this.state.num); // 会输出什么？
      }
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: "App"
      }, _react.default.createElement("h1", null, this.state.num));
    }
  }]);

  return App;
}(_react.default.Component);

_reactDom.default.render(_react.default.createElement(App, null), document.getElementById('root'));
},{"./react":"src/react/index.js","./react-dom":"src/react-dom/index.js"}],"../../.nvm/versions/node/v10.13.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52339" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../.nvm/versions/node/v10.13.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map