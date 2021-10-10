/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.0): util/index.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
const MAX_UID = 1000000;
const MILLISECONDS_MULTIPLIER = 1000;
const TRANSITION_END = "transitionend"; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

const toType = (obj) => {
  if (obj === null || obj === undefined) {
    return `${obj}`;
  }

  return {}.toString
    .call(obj)
    .match(/\s([a-z]+)/i)[1]
    .toLowerCase();
};
/**
 * --------------------------------------------------------------------------
 * Public Util Api
 * --------------------------------------------------------------------------
 */

const getUID = (prefix) => {
  do {
    prefix += Math.floor(Math.random() * MAX_UID);
  } while (document.getElementById(prefix));

  return prefix;
};

const getSelector = (element) => {
  let selector = element.getAttribute("data-bs-target");

  if (!selector || selector === "#") {
    let hrefAttr = element.getAttribute("href"); // The only valid content that could double as a selector are IDs or classes,
    // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
    // `document.querySelector` will rightfully complain it is invalid.
    // See https://github.com/twbs/bootstrap/issues/32273

    if (!hrefAttr || (!hrefAttr.includes("#") && !hrefAttr.startsWith("."))) {
      return null;
    } // Just in case some CMS puts out a full URL with the anchor appended

    if (hrefAttr.includes("#") && !hrefAttr.startsWith("#")) {
      hrefAttr = `#${hrefAttr.split("#")[1]}`;
    }

    selector = hrefAttr && hrefAttr !== "#" ? hrefAttr.trim() : null;
  }

  return selector;
};

const getSelectorFromElement = (element) => {
  const selector = getSelector(element);

  if (selector) {
    return document.querySelector(selector) ? selector : null;
  }

  return null;
};

const getElementFromSelector = (element) => {
  const selector = getSelector(element);
  return selector ? document.querySelector(selector) : null;
};

const getTransitionDurationFromElement = (element) => {
  if (!element) {
    return 0;
  } // Get transition-duration of the element

  let { transitionDuration, transitionDelay } =
    window.getComputedStyle(element);
  const floatTransitionDuration = Number.parseFloat(transitionDuration);
  const floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

  if (!floatTransitionDuration && !floatTransitionDelay) {
    return 0;
  } // If multiple durations are defined, take the first

  transitionDuration = transitionDuration.split(",")[0];
  transitionDelay = transitionDelay.split(",")[0];
  return (
    (Number.parseFloat(transitionDuration) +
      Number.parseFloat(transitionDelay)) *
    MILLISECONDS_MULTIPLIER
  );
};

const triggerTransitionEnd = (element) => {
  element.dispatchEvent(new Event(TRANSITION_END));
};

const isElement = (obj) => {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  if (typeof obj.jquery !== "undefined") {
    obj = obj[0];
  }

  return typeof obj.nodeType !== "undefined";
};

const getElement = (obj) => {
  if (isElement(obj)) {
    // it's a jQuery object or a node element
    return obj.jquery ? obj[0] : obj;
  }

  if (typeof obj === "string" && obj.length > 0) {
    return document.querySelector(obj);
  }

  return null;
};

const typeCheckConfig = (componentName, config, configTypes) => {
  Object.keys(configTypes).forEach((property) => {
    const expectedTypes = configTypes[property];
    const value = config[property];
    const valueType = value && isElement(value) ? "element" : toType(value);

    if (!new RegExp(expectedTypes).test(valueType)) {
      throw new TypeError(
        `${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`
      );
    }
  });
};

const isVisible = (element) => {
  if (!isElement(element) || element.getClientRects().length === 0) {
    return false;
  }

  return getComputedStyle(element).getPropertyValue("visibility") === "visible";
};

const isDisabled = (element) => {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return true;
  }

  if (element.classList.contains("disabled")) {
    return true;
  }

  if (typeof element.disabled !== "undefined") {
    return element.disabled;
  }

  return (
    element.hasAttribute("disabled") &&
    element.getAttribute("disabled") !== "false"
  );
};

const findShadowRoot = (element) => {
  if (!document.documentElement.attachShadow) {
    return null;
  } // Can find the shadow root otherwise it'll return the document

  if (typeof element.getRootNode === "function") {
    const root = element.getRootNode();
    return root instanceof ShadowRoot ? root : null;
  }

  if (element instanceof ShadowRoot) {
    return element;
  } // when we don't find a shadow root

  if (!element.parentNode) {
    return null;
  }

  return findShadowRoot(element.parentNode);
};

const noop = () => {};
/**
 * Trick to restart an element's animation
 *
 * @param {HTMLElement} element
 * @return void
 *
 * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
 */

const reflow = (element) => {
  // eslint-disable-next-line no-unused-expressions
  element.offsetHeight;
};

const getjQuery = () => {
  const { jQuery } = window;

  if (jQuery && !document.body.hasAttribute("data-bs-no-jquery")) {
    return jQuery;
  }

  return null;
};

const DOMContentLoadedCallbacks = [];

const onDOMContentLoaded = (callback) => {
  if (document.readyState === "loading") {
    // add listener on the first call when the document is in loading state
    if (!DOMContentLoadedCallbacks.length) {
      document.addEventListener("DOMContentLoaded", () => {
        DOMContentLoadedCallbacks.forEach((callback) => callback());
      });
    }

    DOMContentLoadedCallbacks.push(callback);
  } else {
    callback();
  }
};

const isRTL = () => document.documentElement.dir === "rtl";

const defineJQueryPlugin = (plugin) => {
  onDOMContentLoaded(() => {
    const $ = getjQuery();
    /* istanbul ignore if */

    if ($) {
      const name = plugin.NAME;
      const JQUERY_NO_CONFLICT = $.fn[name];
      $.fn[name] = plugin.jQueryInterface;
      $.fn[name].Constructor = plugin;

      $.fn[name].noConflict = () => {
        $.fn[name] = JQUERY_NO_CONFLICT;
        return plugin.jQueryInterface;
      };
    }
  });
};

const execute = (callback) => {
  if (typeof callback === "function") {
    callback();
  }
};

const executeAfterTransition = (
  callback,
  transitionElement,
  waitForTransition = true
) => {
  if (!waitForTransition) {
    execute(callback);
    return;
  }

  const durationPadding = 5;
  const emulatedDuration =
    getTransitionDurationFromElement(transitionElement) + durationPadding;
  let called = false;

  const handler = ({ target }) => {
    if (target !== transitionElement) {
      return;
    }

    called = true;
    transitionElement.removeEventListener(TRANSITION_END, handler);
    execute(callback);
  };

  transitionElement.addEventListener(TRANSITION_END, handler);
  setTimeout(() => {
    if (!called) {
      triggerTransitionEnd(transitionElement);
    }
  }, emulatedDuration);
};
/**
 * Return the previous/next element of a list.
 *
 * @param {array} list    The list of elements
 * @param activeElement   The active element
 * @param shouldGetNext   Choose to get next or previous element
 * @param isCycleAllowed
 * @return {Element|elem} The proper element
 */

const getNextActiveElement = (
  list,
  activeElement,
  shouldGetNext,
  isCycleAllowed
) => {
  let index = list.indexOf(activeElement); // if the element does not exist in the list return an element depending on the direction and if cycle is allowed

  if (index === -1) {
    return list[!shouldGetNext && isCycleAllowed ? list.length - 1 : 0];
  }

  const listLength = list.length;
  index += shouldGetNext ? 1 : -1;

  if (isCycleAllowed) {
    index = (index + listLength) % listLength;
  }

  return list[Math.max(0, Math.min(index, listLength - 1))];
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.0): dom/event-handler.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
const stripNameRegex = /\..*/;
const stripUidRegex = /::\d+$/;
const eventRegistry = {}; // Events storage

let uidEvent = 1;
const customEvents = {
  mouseenter: "mouseover",
  mouseleave: "mouseout",
};
const customEventsRegex = /^(mouseenter|mouseleave)/i;
const nativeEvents = new Set([
  "click",
  "dblclick",
  "mouseup",
  "mousedown",
  "contextmenu",
  "mousewheel",
  "DOMMouseScroll",
  "mouseover",
  "mouseout",
  "mousemove",
  "selectstart",
  "selectend",
  "keydown",
  "keypress",
  "keyup",
  "orientationchange",
  "touchstart",
  "touchmove",
  "touchend",
  "touchcancel",
  "pointerdown",
  "pointermove",
  "pointerup",
  "pointerleave",
  "pointercancel",
  "gesturestart",
  "gesturechange",
  "gestureend",
  "focus",
  "blur",
  "change",
  "reset",
  "select",
  "submit",
  "focusin",
  "focusout",
  "load",
  "unload",
  "beforeunload",
  "resize",
  "move",
  "DOMContentLoaded",
  "readystatechange",
  "error",
  "abort",
  "scroll",
]);
/**
 * ------------------------------------------------------------------------
 * Private methods
 * ------------------------------------------------------------------------
 */

function getUidEvent(element, uid) {
  return (uid && `${uid}::${uidEvent++}`) || element.uidEvent || uidEvent++;
}

function getEvent(element) {
  const uid = getUidEvent(element);
  element.uidEvent = uid;
  eventRegistry[uid] = eventRegistry[uid] || {};
  return eventRegistry[uid];
}

function bootstrapHandler(element, fn) {
  return function handler(event) {
    event.delegateTarget = element;

    if (handler.oneOff) {
      EventHandler.off(element, event.type, fn);
    }

    return fn.apply(element, [event]);
  };
}

function bootstrapDelegationHandler(element, selector, fn) {
  return function handler(event) {
    const domElements = element.querySelectorAll(selector);

    for (
      let { target } = event;
      target && target !== this;
      target = target.parentNode
    ) {
      for (let i = domElements.length; i--; ) {
        if (domElements[i] === target) {
          event.delegateTarget = target;

          if (handler.oneOff) {
            // eslint-disable-next-line unicorn/consistent-destructuring
            EventHandler.off(element, event.type, selector, fn);
          }

          return fn.apply(target, [event]);
        }
      }
    } // To please ESLint

    return null;
  };
}

function findHandler(events, handler, delegationSelector = null) {
  const uidEventList = Object.keys(events);

  for (let i = 0, len = uidEventList.length; i < len; i++) {
    const event = events[uidEventList[i]];

    if (
      event.originalHandler === handler &&
      event.delegationSelector === delegationSelector
    ) {
      return event;
    }
  }

  return null;
}

function normalizeParams(originalTypeEvent, handler, delegationFn) {
  const delegation = typeof handler === "string";
  const originalHandler = delegation ? delegationFn : handler;
  let typeEvent = getTypeEvent(originalTypeEvent);
  const isNative = nativeEvents.has(typeEvent);

  if (!isNative) {
    typeEvent = originalTypeEvent;
  }

  return [delegation, originalHandler, typeEvent];
}

function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
  if (typeof originalTypeEvent !== "string" || !element) {
    return;
  }

  if (!handler) {
    handler = delegationFn;
    delegationFn = null;
  } // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
  // this prevents the handler from being dispatched the same way as mouseover or mouseout does

  if (customEventsRegex.test(originalTypeEvent)) {
    const wrapFn = (fn) => {
      return function (event) {
        if (
          !event.relatedTarget ||
          (event.relatedTarget !== event.delegateTarget &&
            !event.delegateTarget.contains(event.relatedTarget))
        ) {
          return fn.call(this, event);
        }
      };
    };

    if (delegationFn) {
      delegationFn = wrapFn(delegationFn);
    } else {
      handler = wrapFn(handler);
    }
  }

  const [delegation, originalHandler, typeEvent] = normalizeParams(
    originalTypeEvent,
    handler,
    delegationFn
  );
  const events = getEvent(element);
  const handlers = events[typeEvent] || (events[typeEvent] = {});
  const previousFn = findHandler(
    handlers,
    originalHandler,
    delegation ? handler : null
  );

  if (previousFn) {
    previousFn.oneOff = previousFn.oneOff && oneOff;
    return;
  }

  const uid = getUidEvent(
    originalHandler,
    originalTypeEvent.replace(namespaceRegex, "")
  );
  const fn = delegation
    ? bootstrapDelegationHandler(element, handler, delegationFn)
    : bootstrapHandler(element, handler);
  fn.delegationSelector = delegation ? handler : null;
  fn.originalHandler = originalHandler;
  fn.oneOff = oneOff;
  fn.uidEvent = uid;
  handlers[uid] = fn;
  element.addEventListener(typeEvent, fn, delegation);
}

function removeHandler(
  element,
  events,
  typeEvent,
  handler,
  delegationSelector
) {
  const fn = findHandler(events[typeEvent], handler, delegationSelector);

  if (!fn) {
    return;
  }

  element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
  delete events[typeEvent][fn.uidEvent];
}

function removeNamespacedHandlers(element, events, typeEvent, namespace) {
  const storeElementEvent = events[typeEvent] || {};
  Object.keys(storeElementEvent).forEach((handlerKey) => {
    if (handlerKey.includes(namespace)) {
      const event = storeElementEvent[handlerKey];
      removeHandler(
        element,
        events,
        typeEvent,
        event.originalHandler,
        event.delegationSelector
      );
    }
  });
}

function getTypeEvent(event) {
  // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
  event = event.replace(stripNameRegex, "");
  return customEvents[event] || event;
}

const EventHandler = {
  on(element, event, handler, delegationFn) {
    addHandler(element, event, handler, delegationFn, false);
  },

  one(element, event, handler, delegationFn) {
    addHandler(element, event, handler, delegationFn, true);
  },

  off(element, originalTypeEvent, handler, delegationFn) {
    if (typeof originalTypeEvent !== "string" || !element) {
      return;
    }

    const [delegation, originalHandler, typeEvent] = normalizeParams(
      originalTypeEvent,
      handler,
      delegationFn
    );
    const inNamespace = typeEvent !== originalTypeEvent;
    const events = getEvent(element);
    const isNamespace = originalTypeEvent.startsWith(".");

    if (typeof originalHandler !== "undefined") {
      // Simplest case: handler is passed, remove that listener ONLY.
      if (!events || !events[typeEvent]) {
        return;
      }

      removeHandler(
        element,
        events,
        typeEvent,
        originalHandler,
        delegation ? handler : null
      );
      return;
    }

    if (isNamespace) {
      Object.keys(events).forEach((elementEvent) => {
        removeNamespacedHandlers(
          element,
          events,
          elementEvent,
          originalTypeEvent.slice(1)
        );
      });
    }

    const storeElementEvent = events[typeEvent] || {};
    Object.keys(storeElementEvent).forEach((keyHandlers) => {
      const handlerKey = keyHandlers.replace(stripUidRegex, "");

      if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
        const event = storeElementEvent[keyHandlers];
        removeHandler(
          element,
          events,
          typeEvent,
          event.originalHandler,
          event.delegationSelector
        );
      }
    });
  },

  trigger(element, event, args) {
    if (typeof event !== "string" || !element) {
      return null;
    }

    const $ = getjQuery();
    const typeEvent = getTypeEvent(event);
    const inNamespace = event !== typeEvent;
    const isNative = nativeEvents.has(typeEvent);
    let jQueryEvent;
    let bubbles = true;
    let nativeDispatch = true;
    let defaultPrevented = false;
    let evt = null;

    if (inNamespace && $) {
      jQueryEvent = $.Event(event, args);
      $(element).trigger(jQueryEvent);
      bubbles = !jQueryEvent.isPropagationStopped();
      nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
      defaultPrevented = jQueryEvent.isDefaultPrevented();
    }

    if (isNative) {
      evt = document.createEvent("HTMLEvents");
      evt.initEvent(typeEvent, bubbles, true);
    } else {
      evt = new CustomEvent(event, {
        bubbles,
        cancelable: true,
      });
    } // merge custom information in our event

    if (typeof args !== "undefined") {
      Object.keys(args).forEach((key) => {
        Object.defineProperty(evt, key, {
          get() {
            return args[key];
          },
        });
      });
    }

    if (defaultPrevented) {
      evt.preventDefault();
    }

    if (nativeDispatch) {
      element.dispatchEvent(evt);
    }

    if (evt.defaultPrevented && typeof jQueryEvent !== "undefined") {
      jQueryEvent.preventDefault();
    }

    return evt;
  },
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.0): dom/data.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const elementMap = new Map();
var Data = {
  set(element, key, instance) {
    if (!elementMap.has(element)) {
      elementMap.set(element, new Map());
    }

    const instanceMap = elementMap.get(element); // make it clear we only want one instance per element
    // can be removed later when multiple key/instances are fine to be used

    if (!instanceMap.has(key) && instanceMap.size !== 0) {
      // eslint-disable-next-line no-console
      console.error(
        `Bootstrap doesn't allow more than one instance per element. Bound instance: ${
          Array.from(instanceMap.keys())[0]
        }.`
      );
      return;
    }

    instanceMap.set(key, instance);
  },

  get(element, key) {
    if (elementMap.has(element)) {
      return elementMap.get(element).get(key) || null;
    }

    return null;
  },

  remove(element, key) {
    if (!elementMap.has(element)) {
      return;
    }

    const instanceMap = elementMap.get(element);
    instanceMap.delete(key); // free up element references if there are no instances left for an element

    if (instanceMap.size === 0) {
      elementMap.delete(element);
    }
  },
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.0): base-component.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const VERSION = "5.1.0";

class BaseComponent {
  constructor(element) {
    element = getElement(element);

    if (!element) {
      return;
    }

    this._element = element;
    Data.set(this._element, this.constructor.DATA_KEY, this);
  }

  dispose() {
    Data.remove(this._element, this.constructor.DATA_KEY);
    EventHandler.off(this._element, this.constructor.EVENT_KEY);
    Object.getOwnPropertyNames(this).forEach((propertyName) => {
      this[propertyName] = null;
    });
  }

  _queueCallback(callback, element, isAnimated = true) {
    executeAfterTransition(callback, element, isAnimated);
  }
  /** Static */

  static getInstance(element) {
    return Data.get(getElement(element), this.DATA_KEY);
  }

  static getOrCreateInstance(element, config = {}) {
    return (
      this.getInstance(element) ||
      new this(element, typeof config === "object" ? config : null)
    );
  }

  static get VERSION() {
    return VERSION;
  }

  static get NAME() {
    throw new Error(
      'You have to implement the static method "NAME", for each component!'
    );
  }

  static get DATA_KEY() {
    return `bs.${this.NAME}`;
  }

  static get EVENT_KEY() {
    return `.${this.DATA_KEY}`;
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.0): util/component-functions.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

const enableDismissTrigger = (component, method = "hide") => {
  const clickEvent = `click.dismiss${component.EVENT_KEY}`;
  const name = component.NAME;
  EventHandler.on(
    document,
    clickEvent,
    `[data-bs-dismiss="${name}"]`,
    function (event) {
      if (["A", "AREA"].includes(this.tagName)) {
        event.preventDefault();
      }

      if (isDisabled(this)) {
        return;
      }

      const target = getElementFromSelector(this) || this.closest(`.${name}`);
      const instance = component.getOrCreateInstance(target); // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method

      instance[method]();
    }
  );
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.0): dom/manipulator.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
function normalizeData(val) {
  if (val === "true") {
    return true;
  }

  if (val === "false") {
    return false;
  }

  if (val === Number(val).toString()) {
    return Number(val);
  }

  if (val === "" || val === "null") {
    return null;
  }

  return val;
}

function normalizeDataKey(key) {
  return key.replace(/[A-Z]/g, (chr) => `-${chr.toLowerCase()}`);
}

const Manipulator = {
  setDataAttribute(element, key, value) {
    element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
  },

  removeDataAttribute(element, key) {
    element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
  },

  getDataAttributes(element) {
    if (!element) {
      return {};
    }

    const attributes = {};
    Object.keys(element.dataset)
      .filter((key) => key.startsWith("bs"))
      .forEach((key) => {
        let pureKey = key.replace(/^bs/, "");
        pureKey =
          pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
        attributes[pureKey] = normalizeData(element.dataset[key]);
      });
    return attributes;
  },

  getDataAttribute(element, key) {
    return normalizeData(
      element.getAttribute(`data-bs-${normalizeDataKey(key)}`)
    );
  },

  offset(element) {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset,
    };
  },

  position(element) {
    return {
      top: element.offsetTop,
      left: element.offsetLeft,
    };
  },
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.0): dom/selector-engine.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
const NODE_TEXT = 3;
const SelectorEngine = {
  find(selector, element = document.documentElement) {
    return [].concat(
      ...Element.prototype.querySelectorAll.call(element, selector)
    );
  },

  findOne(selector, element = document.documentElement) {
    return Element.prototype.querySelector.call(element, selector);
  },

  children(element, selector) {
    return []
      .concat(...element.children)
      .filter((child) => child.matches(selector));
  },

  parents(element, selector) {
    const parents = [];
    let ancestor = element.parentNode;

    while (
      ancestor &&
      ancestor.nodeType === Node.ELEMENT_NODE &&
      ancestor.nodeType !== NODE_TEXT
    ) {
      if (ancestor.matches(selector)) {
        parents.push(ancestor);
      }

      ancestor = ancestor.parentNode;
    }

    return parents;
  },

  prev(element, selector) {
    let previous = element.previousElementSibling;

    while (previous) {
      if (previous.matches(selector)) {
        return [previous];
      }

      previous = previous.previousElementSibling;
    }

    return [];
  },

  next(element, selector) {
    let next = element.nextElementSibling;

    while (next) {
      if (next.matches(selector)) {
        return [next];
      }

      next = next.nextElementSibling;
    }

    return [];
  },

  focusableChildren(element) {
    const focusables = [
      "a",
      "button",
      "input",
      "textarea",
      "select",
      "details",
      "[tabindex]",
      '[contenteditable="true"]',
    ]
      .map((selector) => `${selector}:not([tabindex^="-"])`)
      .join(", ");
    return this.find(focusables, element).filter(
      (el) => !isDisabled(el) && isVisible(el)
    );
  },
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.0): carousel.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$b = "carousel";
const DATA_KEY$a = "bs.carousel";
const EVENT_KEY$a = `.${DATA_KEY$a}`;
const DATA_API_KEY$6 = ".data-api";
const ARROW_LEFT_KEY = "ArrowLeft";
const ARROW_RIGHT_KEY = "ArrowRight";
const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

const SWIPE_THRESHOLD = 40;
const Default$a = {
  interval: 5000,
  keyboard: true,
  slide: false,
  pause: "hover",
  wrap: true,
  touch: true,
};
const DefaultType$a = {
  interval: "(number|boolean)",
  keyboard: "boolean",
  slide: "(boolean|string)",
  pause: "(string|boolean)",
  wrap: "boolean",
  touch: "boolean",
};
const ORDER_NEXT = "next";
const ORDER_PREV = "prev";
const DIRECTION_LEFT = "left";
const DIRECTION_RIGHT = "right";
const KEY_TO_DIRECTION = {
  [ARROW_LEFT_KEY]: DIRECTION_RIGHT,
  [ARROW_RIGHT_KEY]: DIRECTION_LEFT,
};
const EVENT_SLIDE = `slide${EVENT_KEY$a}`;
const EVENT_SLID = `slid${EVENT_KEY$a}`;
const EVENT_KEYDOWN = `keydown${EVENT_KEY$a}`;
const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY$a}`;
const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY$a}`;
const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$a}`;
const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$a}`;
const EVENT_TOUCHEND = `touchend${EVENT_KEY$a}`;
const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$a}`;
const EVENT_POINTERUP = `pointerup${EVENT_KEY$a}`;
const EVENT_DRAG_START = `dragstart${EVENT_KEY$a}`;
const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$a}${DATA_API_KEY$6}`;
const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;
const CLASS_NAME_CAROUSEL = "carousel";
const CLASS_NAME_ACTIVE$2 = "active";
const CLASS_NAME_SLIDE = "slide";
const CLASS_NAME_END = "carousel-item-end";
const CLASS_NAME_START = "carousel-item-start";
const CLASS_NAME_NEXT = "carousel-item-next";
const CLASS_NAME_PREV = "carousel-item-prev";
const CLASS_NAME_POINTER_EVENT = "pointer-event";
const SELECTOR_ACTIVE$1 = ".active";
const SELECTOR_ACTIVE_ITEM = ".active.carousel-item";
const SELECTOR_ITEM = ".carousel-item";
const SELECTOR_ITEM_IMG = ".carousel-item img";
const SELECTOR_NEXT_PREV = ".carousel-item-next, .carousel-item-prev";
const SELECTOR_INDICATORS = ".carousel-indicators";
const SELECTOR_INDICATOR = "[data-bs-target]";
const SELECTOR_DATA_SLIDE = "[data-bs-slide], [data-bs-slide-to]";
const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
const POINTER_TYPE_TOUCH = "touch";
const POINTER_TYPE_PEN = "pen";
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Carousel extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._items = null;
    this._interval = null;
    this._activeElement = null;
    this._isPaused = false;
    this._isSliding = false;
    this.touchTimeout = null;
    this.touchStartX = 0;
    this.touchDeltaX = 0;
    this._config = this._getConfig(config);
    this._indicatorsElement = SelectorEngine.findOne(
      SELECTOR_INDICATORS,
      this._element
    );
    this._touchSupported =
      "ontouchstart" in document.documentElement ||
      navigator.maxTouchPoints > 0;
    this._pointerEvent = Boolean(window.PointerEvent);

    this._addEventListeners();
  } // Getters

  static get Default() {
    return Default$a;
  }

  static get NAME() {
    return NAME$b;
  } // Public

  next() {
    this._slide(ORDER_NEXT);
  }

  nextWhenVisible() {
    // Don't call next when the page isn't visible
    // or the carousel or its parent isn't visible
    if (!document.hidden && isVisible(this._element)) {
      this.next();
    }
  }

  prev() {
    this._slide(ORDER_PREV);
  }

  pause(event) {
    if (!event) {
      this._isPaused = true;
    }

    if (SelectorEngine.findOne(SELECTOR_NEXT_PREV, this._element)) {
      triggerTransitionEnd(this._element);
      this.cycle(true);
    }

    clearInterval(this._interval);
    this._interval = null;
  }

  cycle(event) {
    if (!event) {
      this._isPaused = false;
    }

    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }

    if (this._config && this._config.interval && !this._isPaused) {
      this._updateInterval();

      this._interval = setInterval(
        (document.visibilityState ? this.nextWhenVisible : this.next).bind(
          this
        ),
        this._config.interval
      );
    }
  }

  to(index) {
    this._activeElement = SelectorEngine.findOne(
      SELECTOR_ACTIVE_ITEM,
      this._element
    );

    const activeIndex = this._getItemIndex(this._activeElement);

    if (index > this._items.length - 1 || index < 0) {
      return;
    }

    if (this._isSliding) {
      EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
      return;
    }

    if (activeIndex === index) {
      this.pause();
      this.cycle();
      return;
    }

    const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;

    this._slide(order, this._items[index]);
  } // Private

  _getConfig(config) {
    config = {
      ...Default$a,
      ...Manipulator.getDataAttributes(this._element),
      ...(typeof config === "object" ? config : {}),
    };
    typeCheckConfig(NAME$b, config, DefaultType$a);
    return config;
  }

  _handleSwipe() {
    const absDeltax = Math.abs(this.touchDeltaX);

    if (absDeltax <= SWIPE_THRESHOLD) {
      return;
    }

    const direction = absDeltax / this.touchDeltaX;
    this.touchDeltaX = 0;

    if (!direction) {
      return;
    }

    this._slide(direction > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT);
  }

  _addEventListeners() {
    if (this._config.keyboard) {
      EventHandler.on(this._element, EVENT_KEYDOWN, (event) =>
        this._keydown(event)
      );
    }

    if (this._config.pause === "hover") {
      EventHandler.on(this._element, EVENT_MOUSEENTER, (event) =>
        this.pause(event)
      );
      EventHandler.on(this._element, EVENT_MOUSELEAVE, (event) =>
        this.cycle(event)
      );
    }

    if (this._config.touch && this._touchSupported) {
      this._addTouchEventListeners();
    }
  }

  _addTouchEventListeners() {
    const start = (event) => {
      if (
        this._pointerEvent &&
        (event.pointerType === POINTER_TYPE_PEN ||
          event.pointerType === POINTER_TYPE_TOUCH)
      ) {
        this.touchStartX = event.clientX;
      } else if (!this._pointerEvent) {
        this.touchStartX = event.touches[0].clientX;
      }
    };

    const move = (event) => {
      // ensure swiping with one touch and not pinching
      this.touchDeltaX =
        event.touches && event.touches.length > 1
          ? 0
          : event.touches[0].clientX - this.touchStartX;
    };

    const end = (event) => {
      if (
        this._pointerEvent &&
        (event.pointerType === POINTER_TYPE_PEN ||
          event.pointerType === POINTER_TYPE_TOUCH)
      ) {
        this.touchDeltaX = event.clientX - this.touchStartX;
      }

      this._handleSwipe();

      if (this._config.pause === "hover") {
        // If it's a touch-enabled device, mouseenter/leave are fired as
        // part of the mouse compatibility events on first tap - the carousel
        // would stop cycling until user tapped out of it;
        // here, we listen for touchend, explicitly pause the carousel
        // (as if it's the second time we tap on it, mouseenter compat event
        // is NOT fired) and after a timeout (to allow for mouse compatibility
        // events to fire) we explicitly restart cycling
        this.pause();

        if (this.touchTimeout) {
          clearTimeout(this.touchTimeout);
        }

        this.touchTimeout = setTimeout(
          (event) => this.cycle(event),
          TOUCHEVENT_COMPAT_WAIT + this._config.interval
        );
      }
    };

    SelectorEngine.find(SELECTOR_ITEM_IMG, this._element).forEach((itemImg) => {
      EventHandler.on(itemImg, EVENT_DRAG_START, (e) => e.preventDefault());
    });

    if (this._pointerEvent) {
      EventHandler.on(this._element, EVENT_POINTERDOWN, (event) =>
        start(event)
      );
      EventHandler.on(this._element, EVENT_POINTERUP, (event) => end(event));

      this._element.classList.add(CLASS_NAME_POINTER_EVENT);
    } else {
      EventHandler.on(this._element, EVENT_TOUCHSTART, (event) => start(event));
      EventHandler.on(this._element, EVENT_TOUCHMOVE, (event) => move(event));
      EventHandler.on(this._element, EVENT_TOUCHEND, (event) => end(event));
    }
  }

  _keydown(event) {
    if (/input|textarea/i.test(event.target.tagName)) {
      return;
    }

    const direction = KEY_TO_DIRECTION[event.key];

    if (direction) {
      event.preventDefault();

      this._slide(direction);
    }
  }

  _getItemIndex(element) {
    this._items =
      element && element.parentNode
        ? SelectorEngine.find(SELECTOR_ITEM, element.parentNode)
        : [];
    return this._items.indexOf(element);
  }

  _getItemByOrder(order, activeElement) {
    const isNext = order === ORDER_NEXT;
    return getNextActiveElement(
      this._items,
      activeElement,
      isNext,
      this._config.wrap
    );
  }

  _triggerSlideEvent(relatedTarget, eventDirectionName) {
    const targetIndex = this._getItemIndex(relatedTarget);

    const fromIndex = this._getItemIndex(
      SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element)
    );

    return EventHandler.trigger(this._element, EVENT_SLIDE, {
      relatedTarget,
      direction: eventDirectionName,
      from: fromIndex,
      to: targetIndex,
    });
  }

  _setActiveIndicatorElement(element) {
    if (this._indicatorsElement) {
      const activeIndicator = SelectorEngine.findOne(
        SELECTOR_ACTIVE$1,
        this._indicatorsElement
      );
      activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
      activeIndicator.removeAttribute("aria-current");
      const indicators = SelectorEngine.find(
        SELECTOR_INDICATOR,
        this._indicatorsElement
      );

      for (let i = 0; i < indicators.length; i++) {
        if (
          Number.parseInt(
            indicators[i].getAttribute("data-bs-slide-to"),
            10
          ) === this._getItemIndex(element)
        ) {
          indicators[i].classList.add(CLASS_NAME_ACTIVE$2);
          indicators[i].setAttribute("aria-current", "true");
          break;
        }
      }
    }
  }

  _updateInterval() {
    const element =
      this._activeElement ||
      SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

    if (!element) {
      return;
    }

    const elementInterval = Number.parseInt(
      element.getAttribute("data-bs-interval"),
      10
    );

    if (elementInterval) {
      this._config.defaultInterval =
        this._config.defaultInterval || this._config.interval;
      this._config.interval = elementInterval;
    } else {
      this._config.interval =
        this._config.defaultInterval || this._config.interval;
    }
  }

  _slide(directionOrOrder, element) {
    const order = this._directionToOrder(directionOrOrder);

    const activeElement = SelectorEngine.findOne(
      SELECTOR_ACTIVE_ITEM,
      this._element
    );

    const activeElementIndex = this._getItemIndex(activeElement);

    const nextElement = element || this._getItemByOrder(order, activeElement);

    const nextElementIndex = this._getItemIndex(nextElement);

    const isCycling = Boolean(this._interval);
    const isNext = order === ORDER_NEXT;
    const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
    const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;

    const eventDirectionName = this._orderToDirection(order);

    if (nextElement && nextElement.classList.contains(CLASS_NAME_ACTIVE$2)) {
      this._isSliding = false;
      return;
    }

    if (this._isSliding) {
      return;
    }

    const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);

    if (slideEvent.defaultPrevented) {
      return;
    }

    if (!activeElement || !nextElement) {
      // Some weirdness is happening, so we bail
      return;
    }

    this._isSliding = true;

    if (isCycling) {
      this.pause();
    }

    this._setActiveIndicatorElement(nextElement);

    this._activeElement = nextElement;

    const triggerSlidEvent = () => {
      EventHandler.trigger(this._element, EVENT_SLID, {
        relatedTarget: nextElement,
        direction: eventDirectionName,
        from: activeElementIndex,
        to: nextElementIndex,
      });
    };

    if (this._element.classList.contains(CLASS_NAME_SLIDE)) {
      nextElement.classList.add(orderClassName);
      reflow(nextElement);
      activeElement.classList.add(directionalClassName);
      nextElement.classList.add(directionalClassName);

      const completeCallBack = () => {
        nextElement.classList.remove(directionalClassName, orderClassName);
        nextElement.classList.add(CLASS_NAME_ACTIVE$2);
        activeElement.classList.remove(
          CLASS_NAME_ACTIVE$2,
          orderClassName,
          directionalClassName
        );
        this._isSliding = false;
        setTimeout(triggerSlidEvent, 0);
      };

      this._queueCallback(completeCallBack, activeElement, true);
    } else {
      activeElement.classList.remove(CLASS_NAME_ACTIVE$2);
      nextElement.classList.add(CLASS_NAME_ACTIVE$2);
      this._isSliding = false;
      triggerSlidEvent();
    }

    if (isCycling) {
      this.cycle();
    }
  }

  _directionToOrder(direction) {
    if (![DIRECTION_RIGHT, DIRECTION_LEFT].includes(direction)) {
      return direction;
    }

    if (isRTL()) {
      return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
    }

    return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
  }

  _orderToDirection(order) {
    if (![ORDER_NEXT, ORDER_PREV].includes(order)) {
      return order;
    }

    if (isRTL()) {
      return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }

    return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
  } // Static

  static carouselInterface(element, config) {
    const data = Carousel.getOrCreateInstance(element, config);
    let { _config } = data;

    if (typeof config === "object") {
      _config = { ..._config, ...config };
    }

    const action = typeof config === "string" ? config : _config.slide;

    if (typeof config === "number") {
      data.to(config);
    } else if (typeof action === "string") {
      if (typeof data[action] === "undefined") {
        throw new TypeError(`No method named "${action}"`);
      }

      data[action]();
    } else if (_config.interval && _config.ride) {
      data.pause();
      data.cycle();
    }
  }

  static jQueryInterface(config) {
    return this.each(function () {
      Carousel.carouselInterface(this, config);
    });
  }

  static dataApiClickHandler(event) {
    const target = getElementFromSelector(this);

    if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
      return;
    }

    const config = {
      ...Manipulator.getDataAttributes(target),
      ...Manipulator.getDataAttributes(this),
    };
    const slideIndex = this.getAttribute("data-bs-slide-to");

    if (slideIndex) {
      config.interval = false;
    }

    Carousel.carouselInterface(target, config);

    if (slideIndex) {
      Carousel.getInstance(target).to(slideIndex);
    }

    event.preventDefault();
  }
}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

EventHandler.on(
  document,
  EVENT_CLICK_DATA_API$5,
  SELECTOR_DATA_SLIDE,
  Carousel.dataApiClickHandler
);
EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
  const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);

  for (let i = 0, len = carousels.length; i < len; i++) {
    Carousel.carouselInterface(
      carousels[i],
      Carousel.getInstance(carousels[i])
    );
  }
});
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Carousel to jQuery only if jQuery is present
 */

defineJQueryPlugin(Carousel);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.0): collapse.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$a = "collapse";
const DATA_KEY$9 = "bs.collapse";
const EVENT_KEY$9 = `.${DATA_KEY$9}`;
const DATA_API_KEY$5 = ".data-api";
const Default$9 = {
  toggle: true,
  parent: null,
};
const DefaultType$9 = {
  toggle: "boolean",
  parent: "(null|element)",
};
const EVENT_SHOW$5 = `show${EVENT_KEY$9}`;
const EVENT_SHOWN$5 = `shown${EVENT_KEY$9}`;
const EVENT_HIDE$5 = `hide${EVENT_KEY$9}`;
const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$9}`;
const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$9}${DATA_API_KEY$5}`;
const CLASS_NAME_SHOW$7 = "show";
const CLASS_NAME_COLLAPSE = "collapse";
const CLASS_NAME_COLLAPSING = "collapsing";
const CLASS_NAME_COLLAPSED = "collapsed";
const CLASS_NAME_HORIZONTAL = "collapse-horizontal";
const WIDTH = "width";
const HEIGHT = "height";
const SELECTOR_ACTIVES = ".show, .collapsing";
const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Collapse extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._isTransitioning = false;
    this._config = this._getConfig(config);
    this._triggerArray = [];
    const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);

    for (let i = 0, len = toggleList.length; i < len; i++) {
      const elem = toggleList[i];
      const selector = getSelectorFromElement(elem);
      const filterElement = SelectorEngine.find(selector).filter(
        (foundElem) => foundElem === this._element
      );

      if (selector !== null && filterElement.length) {
        this._selector = selector;

        this._triggerArray.push(elem);
      }
    }

    this._initializeChildren();

    if (!this._config.parent) {
      this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
    }

    if (this._config.toggle) {
      this.toggle();
    }
  } // Getters

  static get Default() {
    return Default$9;
  }

  static get NAME() {
    return NAME$a;
  } // Public

  toggle() {
    if (this._isShown()) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    if (this._isTransitioning || this._isShown()) {
      return;
    }

    let actives = [];
    let activesData;

    if (this._config.parent) {
      const children = SelectorEngine.find(
        `.${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`,
        this._config.parent
      );
      actives = SelectorEngine.find(
        SELECTOR_ACTIVES,
        this._config.parent
      ).filter((elem) => !children.includes(elem)); // remove children if greater depth
    }

    const container = SelectorEngine.findOne(this._selector);

    if (actives.length) {
      const tempActiveData = actives.find((elem) => container !== elem);
      activesData = tempActiveData
        ? Collapse.getInstance(tempActiveData)
        : null;

      if (activesData && activesData._isTransitioning) {
        return;
      }
    }

    const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$5);

    if (startEvent.defaultPrevented) {
      return;
    }

    actives.forEach((elemActive) => {
      if (container !== elemActive) {
        Collapse.getOrCreateInstance(elemActive, {
          toggle: false,
        }).hide();
      }

      if (!activesData) {
        Data.set(elemActive, DATA_KEY$9, null);
      }
    });

    const dimension = this._getDimension();

    this._element.classList.remove(CLASS_NAME_COLLAPSE);

    this._element.classList.add(CLASS_NAME_COLLAPSING);

    this._element.style[dimension] = 0;

    this._addAriaAndCollapsedClass(this._triggerArray, true);

    this._isTransitioning = true;

    const complete = () => {
      this._isTransitioning = false;

      this._element.classList.remove(CLASS_NAME_COLLAPSING);

      this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);

      this._element.style[dimension] = "";
      EventHandler.trigger(this._element, EVENT_SHOWN$5);
    };

    const capitalizedDimension =
      dimension[0].toUpperCase() + dimension.slice(1);
    const scrollSize = `scroll${capitalizedDimension}`;

    this._queueCallback(complete, this._element, true);

    this._element.style[dimension] = `${this._element[scrollSize]}px`;
  }

  hide() {
    if (this._isTransitioning || !this._isShown()) {
      return;
    }

    const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$5);

    if (startEvent.defaultPrevented) {
      return;
    }

    const dimension = this._getDimension();

    this._element.style[dimension] = `${
      this._element.getBoundingClientRect()[dimension]
    }px`;
    reflow(this._element);

    this._element.classList.add(CLASS_NAME_COLLAPSING);

    this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);

    const triggerArrayLength = this._triggerArray.length;

    for (let i = 0; i < triggerArrayLength; i++) {
      const trigger = this._triggerArray[i];
      const elem = getElementFromSelector(trigger);

      if (elem && !this._isShown(elem)) {
        this._addAriaAndCollapsedClass([trigger], false);
      }
    }

    this._isTransitioning = true;

    const complete = () => {
      this._isTransitioning = false;

      this._element.classList.remove(CLASS_NAME_COLLAPSING);

      this._element.classList.add(CLASS_NAME_COLLAPSE);

      EventHandler.trigger(this._element, EVENT_HIDDEN$5);
    };

    this._element.style[dimension] = "";

    this._queueCallback(complete, this._element, true);
  }

  _isShown(element = this._element) {
    return element.classList.contains(CLASS_NAME_SHOW$7);
  } // Private

  _getConfig(config) {
    config = {
      ...Default$9,
      ...Manipulator.getDataAttributes(this._element),
      ...config,
    };
    config.toggle = Boolean(config.toggle); // Coerce string values

    config.parent = getElement(config.parent);
    typeCheckConfig(NAME$a, config, DefaultType$9);
    return config;
  }

  _getDimension() {
    return this._element.classList.contains(CLASS_NAME_HORIZONTAL)
      ? WIDTH
      : HEIGHT;
  }

  _initializeChildren() {
    if (!this._config.parent) {
      return;
    }

    const children = SelectorEngine.find(
      `.${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`,
      this._config.parent
    );
    SelectorEngine.find(SELECTOR_DATA_TOGGLE$4, this._config.parent)
      .filter((elem) => !children.includes(elem))
      .forEach((element) => {
        const selected = getElementFromSelector(element);

        if (selected) {
          this._addAriaAndCollapsedClass([element], this._isShown(selected));
        }
      });
  }

  _addAriaAndCollapsedClass(triggerArray, isOpen) {
    if (!triggerArray.length) {
      return;
    }

    triggerArray.forEach((elem) => {
      if (isOpen) {
        elem.classList.remove(CLASS_NAME_COLLAPSED);
      } else {
        elem.classList.add(CLASS_NAME_COLLAPSED);
      }

      elem.setAttribute("aria-expanded", isOpen);
    });
  } // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const _config = {};

      if (typeof config === "string" && /show|hide/.test(config)) {
        _config.toggle = false;
      }

      const data = Collapse.getOrCreateInstance(this, _config);

      if (typeof config === "string") {
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    });
  }
}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

EventHandler.on(
  document,
  EVENT_CLICK_DATA_API$4,
  SELECTOR_DATA_TOGGLE$4,
  function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (
      event.target.tagName === "A" ||
      (event.delegateTarget && event.delegateTarget.tagName === "A")
    ) {
      event.preventDefault();
    }

    const selector = getSelectorFromElement(this);
    const selectorElements = SelectorEngine.find(selector);
    selectorElements.forEach((element) => {
      Collapse.getOrCreateInstance(element, {
        toggle: false,
      }).toggle();
    });
  }
);
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Collapse to jQuery only if jQuery is present
 */

defineJQueryPlugin(Collapse);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.0): dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$9 = "dropdown";
const DATA_KEY$8 = "bs.dropdown";
const EVENT_KEY$8 = `.${DATA_KEY$8}`;
const DATA_API_KEY$4 = ".data-api";
const ESCAPE_KEY$2 = "Escape";
const SPACE_KEY = "Space";
const TAB_KEY$1 = "Tab";
const ARROW_UP_KEY = "ArrowUp";
const ARROW_DOWN_KEY = "ArrowDown";
const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

const REGEXP_KEYDOWN = new RegExp(
  `${ARROW_UP_KEY}|${ARROW_DOWN_KEY}|${ESCAPE_KEY$2}`
);
const EVENT_HIDE$4 = `hide${EVENT_KEY$8}`;
const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$8}`;
const EVENT_SHOW$4 = `show${EVENT_KEY$8}`;
const EVENT_SHOWN$4 = `shown${EVENT_KEY$8}`;
const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$8}${DATA_API_KEY$4}`;
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$8}${DATA_API_KEY$4}`;
const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$8}${DATA_API_KEY$4}`;
const CLASS_NAME_SHOW$6 = "show";
const CLASS_NAME_DROPUP = "dropup";
const CLASS_NAME_DROPEND = "dropend";
const CLASS_NAME_DROPSTART = "dropstart";
const CLASS_NAME_NAVBAR = "navbar";
const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]';
const SELECTOR_MENU = ".dropdown-menu";
const SELECTOR_NAVBAR_NAV = ".navbar-nav";
const SELECTOR_VISIBLE_ITEMS =
  ".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)";
const PLACEMENT_TOP = isRTL() ? "top-end" : "top-start";
const PLACEMENT_TOPEND = isRTL() ? "top-start" : "top-end";
const PLACEMENT_BOTTOM = isRTL() ? "bottom-end" : "bottom-start";
const PLACEMENT_BOTTOMEND = isRTL() ? "bottom-start" : "bottom-end";
const PLACEMENT_RIGHT = isRTL() ? "left-start" : "right-start";
const PLACEMENT_LEFT = isRTL() ? "right-start" : "left-start";
const Default$8 = {
  offset: [0, 2],
  boundary: "clippingParents",
  reference: "toggle",
  display: "dynamic",
  popperConfig: null,
  autoClose: true,
};
const DefaultType$8 = {
  offset: "(array|string|function)",
  boundary: "(string|element)",
  reference: "(string|element|object)",
  display: "string",
  popperConfig: "(null|object|function)",
  autoClose: "(boolean|string)",
};
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Dropdown extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._popper = null;
    this._config = this._getConfig(config);
    this._menu = this._getMenuElement();
    this._inNavbar = this._detectNavbar();
  } // Getters

  static get Default() {
    return Default$8;
  }

  static get DefaultType() {
    return DefaultType$8;
  }

  static get NAME() {
    return NAME$9;
  } // Public

  toggle() {
    return this._isShown() ? this.hide() : this.show();
  }

  show() {
    if (isDisabled(this._element) || this._isShown(this._menu)) {
      return;
    }

    const relatedTarget = {
      relatedTarget: this._element,
    };
    const showEvent = EventHandler.trigger(
      this._element,
      EVENT_SHOW$4,
      relatedTarget
    );

    if (showEvent.defaultPrevented) {
      return;
    }

    const parent = Dropdown.getParentFromElement(this._element); // Totally disable Popper for Dropdowns in Navbar

    if (this._inNavbar) {
      Manipulator.setDataAttribute(this._menu, "popper", "none");
    } else {
      this._createPopper(parent);
    } // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html

    if (
      "ontouchstart" in document.documentElement &&
      !parent.closest(SELECTOR_NAVBAR_NAV)
    ) {
      []
        .concat(...document.body.children)
        .forEach((elem) => EventHandler.on(elem, "mouseover", noop));
    }

    this._element.focus();

    this._element.setAttribute("aria-expanded", true);

    this._menu.classList.add(CLASS_NAME_SHOW$6);

    this._element.classList.add(CLASS_NAME_SHOW$6);

    EventHandler.trigger(this._element, EVENT_SHOWN$4, relatedTarget);
  }

  hide() {
    if (isDisabled(this._element) || !this._isShown(this._menu)) {
      return;
    }

    const relatedTarget = {
      relatedTarget: this._element,
    };

    this._completeHide(relatedTarget);
  }

  dispose() {
    if (this._popper) {
      this._popper.destroy();
    }

    super.dispose();
  }

  update() {
    this._inNavbar = this._detectNavbar();

    if (this._popper) {
      this._popper.update();
    }
  } // Private

  _completeHide(relatedTarget) {
    const hideEvent = EventHandler.trigger(
      this._element,
      EVENT_HIDE$4,
      relatedTarget
    );

    if (hideEvent.defaultPrevented) {
      return;
    } // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support

    if ("ontouchstart" in document.documentElement) {
      []
        .concat(...document.body.children)
        .forEach((elem) => EventHandler.off(elem, "mouseover", noop));
    }

    if (this._popper) {
      this._popper.destroy();
    }

    this._menu.classList.remove(CLASS_NAME_SHOW$6);

    this._element.classList.remove(CLASS_NAME_SHOW$6);

    this._element.setAttribute("aria-expanded", "false");

    Manipulator.removeDataAttribute(this._menu, "popper");
    EventHandler.trigger(this._element, EVENT_HIDDEN$4, relatedTarget);
  }

  _getConfig(config) {
    config = {
      ...this.constructor.Default,
      ...Manipulator.getDataAttributes(this._element),
      ...config,
    };
    typeCheckConfig(NAME$9, config, this.constructor.DefaultType);

    if (
      typeof config.reference === "object" &&
      !isElement(config.reference) &&
      typeof config.reference.getBoundingClientRect !== "function"
    ) {
      // Popper virtual elements require a getBoundingClientRect method
      throw new TypeError(
        `${NAME$9.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`
      );
    }

    return config;
  }

  _createPopper(parent) {
    if (typeof Popper__namespace === "undefined") {
      throw new TypeError(
        "Bootstrap's dropdowns require Popper (https://popper.js.org)"
      );
    }

    let referenceElement = this._element;

    if (this._config.reference === "parent") {
      referenceElement = parent;
    } else if (isElement(this._config.reference)) {
      referenceElement = getElement(this._config.reference);
    } else if (typeof this._config.reference === "object") {
      referenceElement = this._config.reference;
    }

    const popperConfig = this._getPopperConfig();

    const isDisplayStatic = popperConfig.modifiers.find(
      (modifier) =>
        modifier.name === "applyStyles" && modifier.enabled === false
    );
    this._popper = Popper__namespace.createPopper(
      referenceElement,
      this._menu,
      popperConfig
    );

    if (isDisplayStatic) {
      Manipulator.setDataAttribute(this._menu, "popper", "static");
    }
  }

  _isShown(element = this._element) {
    return element.classList.contains(CLASS_NAME_SHOW$6);
  }

  _getMenuElement() {
    return SelectorEngine.next(this._element, SELECTOR_MENU)[0];
  }

  _getPlacement() {
    const parentDropdown = this._element.parentNode;

    if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
      return PLACEMENT_RIGHT;
    }

    if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
      return PLACEMENT_LEFT;
    } // We need to trim the value because custom properties can also include spaces

    const isEnd =
      getComputedStyle(this._menu).getPropertyValue("--bs-position").trim() ===
      "end";

    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
      return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
    }

    return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
  }

  _detectNavbar() {
    return this._element.closest(`.${CLASS_NAME_NAVBAR}`) !== null;
  }

  _getOffset() {
    const { offset } = this._config;

    if (typeof offset === "string") {
      return offset.split(",").map((val) => Number.parseInt(val, 10));
    }

    if (typeof offset === "function") {
      return (popperData) => offset(popperData, this._element);
    }

    return offset;
  }

  _getPopperConfig() {
    const defaultBsPopperConfig = {
      placement: this._getPlacement(),
      modifiers: [
        {
          name: "preventOverflow",
          options: {
            boundary: this._config.boundary,
          },
        },
        {
          name: "offset",
          options: {
            offset: this._getOffset(),
          },
        },
      ],
    }; // Disable Popper if we have a static display

    if (this._config.display === "static") {
      defaultBsPopperConfig.modifiers = [
        {
          name: "applyStyles",
          enabled: false,
        },
      ];
    }

    return {
      ...defaultBsPopperConfig,
      ...(typeof this._config.popperConfig === "function"
        ? this._config.popperConfig(defaultBsPopperConfig)
        : this._config.popperConfig),
    };
  }

  _selectMenuItem({ key, target }) {
    const items = SelectorEngine.find(
      SELECTOR_VISIBLE_ITEMS,
      this._menu
    ).filter(isVisible);

    if (!items.length) {
      return;
    } // if target isn't included in items (e.g. when expanding the dropdown)
    // allow cycling to get the last item in case key equals ARROW_UP_KEY

    getNextActiveElement(
      items,
      target,
      key === ARROW_DOWN_KEY,
      !items.includes(target)
    ).focus();
  } // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = Dropdown.getOrCreateInstance(this, config);

      if (typeof config !== "string") {
        return;
      }

      if (typeof data[config] === "undefined") {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config]();
    });
  }

  static clearMenus(event) {
    if (
      event &&
      (event.button === RIGHT_MOUSE_BUTTON ||
        (event.type === "keyup" && event.key !== TAB_KEY$1))
    ) {
      return;
    }

    const toggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE$3);

    for (let i = 0, len = toggles.length; i < len; i++) {
      const context = Dropdown.getInstance(toggles[i]);

      if (!context || context._config.autoClose === false) {
        continue;
      }

      if (!context._isShown()) {
        continue;
      }

      const relatedTarget = {
        relatedTarget: context._element,
      };

      if (event) {
        const composedPath = event.composedPath();
        const isMenuTarget = composedPath.includes(context._menu);

        if (
          composedPath.includes(context._element) ||
          (context._config.autoClose === "inside" && !isMenuTarget) ||
          (context._config.autoClose === "outside" && isMenuTarget)
        ) {
          continue;
        } // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu

        if (
          context._menu.contains(event.target) &&
          ((event.type === "keyup" && event.key === TAB_KEY$1) ||
            /input|select|option|textarea|form/i.test(event.target.tagName))
        ) {
          continue;
        }

        if (event.type === "click") {
          relatedTarget.clickEvent = event;
        }
      }

      context._completeHide(relatedTarget);
    }
  }

  static getParentFromElement(element) {
    return getElementFromSelector(element) || element.parentNode;
  }

  static dataApiKeydownHandler(event) {
    // If not input/textarea:
    //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
    // If input/textarea:
    //  - If space key => not a dropdown command
    //  - If key is other than escape
    //    - If key is not up or down => not a dropdown command
    //    - If trigger inside the menu => not a dropdown command
    if (
      /input|textarea/i.test(event.target.tagName)
        ? event.key === SPACE_KEY ||
          (event.key !== ESCAPE_KEY$2 &&
            ((event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY) ||
              event.target.closest(SELECTOR_MENU)))
        : !REGEXP_KEYDOWN.test(event.key)
    ) {
      return;
    }

    const isActive = this.classList.contains(CLASS_NAME_SHOW$6);

    if (!isActive && event.key === ESCAPE_KEY$2) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (isDisabled(this)) {
      return;
    }

    const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3)
      ? this
      : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0];
    const instance = Dropdown.getOrCreateInstance(getToggleButton);

    if (event.key === ESCAPE_KEY$2) {
      instance.hide();
      return;
    }

    if (event.key === ARROW_UP_KEY || event.key === ARROW_DOWN_KEY) {
      if (!isActive) {
        instance.show();
      }

      instance._selectMenuItem(event);

      return;
    }

    if (!isActive || event.key === SPACE_KEY) {
      Dropdown.clearMenus();
    }
  }
}
/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

EventHandler.on(
  document,
  EVENT_KEYDOWN_DATA_API,
  SELECTOR_DATA_TOGGLE$3,
  Dropdown.dataApiKeydownHandler
);
EventHandler.on(
  document,
  EVENT_KEYDOWN_DATA_API,
  SELECTOR_MENU,
  Dropdown.dataApiKeydownHandler
);
EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
EventHandler.on(
  document,
  EVENT_CLICK_DATA_API$3,
  SELECTOR_DATA_TOGGLE$3,
  function (event) {
    event.preventDefault();
    Dropdown.getOrCreateInstance(this).toggle();
  }
);
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Dropdown to jQuery only if jQuery is present
 */

defineJQueryPlugin(Dropdown);

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*!
 * Splide.js
 * Version  : 3.1.2
 * License  : MIT
 * Copyright: 2021 Naotoshi Fujita
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Splide = factory());
})(this, function () {
  'use strict';

  var PROJECT_CODE = "splide";
  var DATA_ATTRIBUTE = "data-" + PROJECT_CODE;
  var CREATED = 1;
  var MOUNTED = 2;
  var IDLE = 3;
  var MOVING = 4;
  var DESTROYED = 5;
  var STATES = {
    CREATED: CREATED,
    MOUNTED: MOUNTED,
    IDLE: IDLE,
    MOVING: MOVING,
    DESTROYED: DESTROYED
  };
  var DEFAULT_EVENT_PRIORITY = 10;
  var DEFAULT_USER_EVENT_PRIORITY = 20;

  function empty(array) {
    array.length = 0;
  }

  function isObject(subject) {
    return !isNull(subject) && typeof subject === "object";
  }

  function isArray(subject) {
    return Array.isArray(subject);
  }

  function isFunction(subject) {
    return typeof subject === "function";
  }

  function isString(subject) {
    return typeof subject === "string";
  }

  function isUndefined(subject) {
    return typeof subject === "undefined";
  }

  function isNull(subject) {
    return subject === null;
  }

  function isHTMLElement(subject) {
    return subject instanceof HTMLElement;
  }

  function toArray(value) {
    return isArray(value) ? value : [value];
  }

  function forEach(values, iteratee) {
    toArray(values).forEach(iteratee);
  }

  function includes(array, value) {
    return array.indexOf(value) > -1;
  }

  function push(array, items) {
    array.push.apply(array, toArray(items));
    return array;
  }

  var arrayProto = Array.prototype;

  function slice(arrayLike, start, end) {
    return arrayProto.slice.call(arrayLike, start, end);
  }

  function find(arrayLike, predicate) {
    return slice(arrayLike).filter(predicate)[0];
  }

  function toggleClass(elm, classes, add) {
    if (elm) {
      forEach(classes, function (name) {
        if (name) {
          elm.classList[add ? "add" : "remove"](name);
        }
      });
    }
  }

  function addClass(elm, classes) {
    toggleClass(elm, isString(classes) ? classes.split(" ") : classes, true);
  }

  function append(parent, children) {
    forEach(children, parent.appendChild.bind(parent));
  }

  function before(nodes, ref) {
    forEach(nodes, function (node) {
      var parent = ref.parentNode;

      if (parent) {
        parent.insertBefore(node, ref);
      }
    });
  }

  function matches(elm, selector) {
    return (elm["msMatchesSelector"] || elm.matches).call(elm, selector);
  }

  function children(parent, selector) {
    return parent ? slice(parent.children).filter(function (child) {
      return matches(child, selector);
    }) : [];
  }

  function child(parent, selector) {
    return selector ? children(parent, selector)[0] : parent.firstElementChild;
  }

  function forOwn(object, iteratee) {
    if (object) {
      var keys = Object.keys(object);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];

        if (key !== "__proto__") {
          if (iteratee(object[key], key) === false) {
            break;
          }
        }
      }
    }

    return object;
  }

  function assign(object) {
    slice(arguments, 1).forEach(function (source) {
      forOwn(source, function (value, key) {
        object[key] = source[key];
      });
    });
    return object;
  }

  function merge(object, source) {
    forOwn(source, function (value, key) {
      if (isArray(value)) {
        object[key] = value.slice();
      } else if (isObject(value)) {
        object[key] = merge(isObject(object[key]) ? object[key] : {}, value);
      } else {
        object[key] = value;
      }
    });
    return object;
  }

  function removeAttribute(elm, attrs) {
    if (elm) {
      forEach(attrs, function (attr) {
        elm.removeAttribute(attr);
      });
    }
  }

  function setAttribute(elm, attrs, value) {
    if (isObject(attrs)) {
      forOwn(attrs, function (value2, name) {
        setAttribute(elm, name, value2);
      });
    } else {
      isNull(value) ? removeAttribute(elm, attrs) : elm.setAttribute(attrs, String(value));
    }
  }

  function create(tag, attrs, parent) {
    var elm = document.createElement(tag);

    if (attrs) {
      isString(attrs) ? addClass(elm, attrs) : setAttribute(elm, attrs);
    }

    parent && append(parent, elm);
    return elm;
  }

  function style(elm, prop, value) {
    if (isUndefined(value)) {
      return getComputedStyle(elm)[prop];
    }

    if (!isNull(value)) {
      var style2 = elm.style;
      value = "" + value;

      if (style2[prop] !== value) {
        style2[prop] = value;
      }
    }
  }

  function display(elm, display2) {
    style(elm, "display", display2);
  }

  function getAttribute(elm, attr) {
    return elm.getAttribute(attr);
  }

  function hasClass(elm, className) {
    return elm && elm.classList.contains(className);
  }

  function rect(target) {
    return target.getBoundingClientRect();
  }

  function remove(nodes) {
    forEach(nodes, function (node) {
      if (node && node.parentNode) {
        node.parentNode.removeChild(node);
      }
    });
  }

  function measure(parent, value) {
    if (isString(value)) {
      var div = create("div", {
        style: "width: " + value + "; position: absolute;"
      }, parent);
      value = rect(div).width;
      remove(div);
    }

    return value;
  }

  function parseHtml(html) {
    return child(new DOMParser().parseFromString(html, "text/html").body);
  }

  function prevent(e, stopPropagation) {
    e.preventDefault();

    if (stopPropagation) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }

  function query(parent, selector) {
    return parent && parent.querySelector(selector);
  }

  function queryAll(parent, selector) {
    return slice(parent.querySelectorAll(selector));
  }

  function removeClass(elm, classes) {
    toggleClass(elm, classes, false);
  }

  function unit(value) {
    return isString(value) ? value : value ? value + "px" : "";
  }

  function assert(condition, message) {
    if (message === void 0) {
      message = "";
    }

    if (!condition) {
      throw new Error("[" + PROJECT_CODE + "] " + message);
    }
  }

  function nextTick(callback) {
    setTimeout(callback);
  }

  var noop = function noop() {};

  function raf(func) {
    return requestAnimationFrame(func);
  }

  var min = Math.min,
      max = Math.max,
      floor = Math.floor,
      ceil = Math.ceil,
      abs = Math.abs;

  function approximatelyEqual(x, y, epsilon) {
    return abs(x - y) < epsilon;
  }

  function between(number, minOrMax, maxOrMin, exclusive) {
    var minimum = min(minOrMax, maxOrMin);
    var maximum = max(minOrMax, maxOrMin);
    return exclusive ? minimum < number && number < maximum : minimum <= number && number <= maximum;
  }

  function clamp(number, x, y) {
    var minimum = min(x, y);
    var maximum = max(x, y);
    return min(max(minimum, number), maximum);
  }

  function sign(x) {
    return +(x > 0) - +(x < 0);
  }

  function format(string, replacements) {
    forEach(replacements, function (replacement) {
      string = string.replace("%s", "" + replacement);
    });
    return string;
  }

  function pad(number) {
    return number < 10 ? "0" + number : "" + number;
  }

  var ids = {};

  function uniqueId(prefix) {
    return "" + prefix + pad(ids[prefix] = (ids[prefix] || 0) + 1);
  }

  function EventBus() {
    var handlers = {};

    function on(events, callback, key, priority) {
      if (priority === void 0) {
        priority = DEFAULT_EVENT_PRIORITY;
      }

      forEachEvent(events, function (event, namespace) {
        handlers[event] = handlers[event] || [];
        push(handlers[event], {
          _event: event,
          _callback: callback,
          _namespace: namespace,
          _priority: priority,
          _key: key
        }).sort(function (handler1, handler2) {
          return handler1._priority - handler2._priority;
        });
      });
    }

    function off(events, key) {
      forEachEvent(events, function (event, namespace) {
        var eventHandlers = handlers[event];
        handlers[event] = eventHandlers && eventHandlers.filter(function (handler) {
          return handler._key ? handler._key !== key : key || handler._namespace !== namespace;
        });
      });
    }

    function offBy(key) {
      forOwn(handlers, function (eventHandlers, event) {
        off(event, key);
      });
    }

    function emit(event) {
      var _arguments = arguments;
      (handlers[event] || []).forEach(function (handler) {
        handler._callback.apply(handler, slice(_arguments, 1));
      });
    }

    function destroy() {
      handlers = {};
    }

    function forEachEvent(events, iteratee) {
      toArray(events).join(" ").split(" ").forEach(function (eventNS) {
        var fragments = eventNS.split(".");
        iteratee(fragments[0], fragments[1]);
      });
    }

    return {
      on: on,
      off: off,
      offBy: offBy,
      emit: emit,
      destroy: destroy
    };
  }

  var EVENT_MOUNTED = "mounted";
  var EVENT_READY = "ready";
  var EVENT_MOVE = "move";
  var EVENT_MOVED = "moved";
  var EVENT_CLICK = "click";
  var EVENT_ACTIVE = "active";
  var EVENT_INACTIVE = "inactive";
  var EVENT_VISIBLE = "visible";
  var EVENT_HIDDEN = "hidden";
  var EVENT_SLIDE_KEYDOWN = "slide:keydown";
  var EVENT_REFRESH = "refresh";
  var EVENT_UPDATED = "updated";
  var EVENT_RESIZE = "resize";
  var EVENT_RESIZED = "resized";
  var EVENT_REPOSITIONED = "repositioned";
  var EVENT_DRAG = "drag";
  var EVENT_DRAGGING = "dragging";
  var EVENT_DRAGGED = "dragged";
  var EVENT_SCROLL = "scroll";
  var EVENT_SCROLLED = "scrolled";
  var EVENT_DESTROY = "destroy";
  var EVENT_ARROWS_MOUNTED = "arrows:mounted";
  var EVENT_ARROWS_UPDATED = "arrows:updated";
  var EVENT_PAGINATION_MOUNTED = "pagination:mounted";
  var EVENT_PAGINATION_UPDATED = "pagination:updated";
  var EVENT_NAVIGATION_MOUNTED = "navigation:mounted";
  var EVENT_AUTOPLAY_PLAY = "autoplay:play";
  var EVENT_AUTOPLAY_PLAYING = "autoplay:playing";
  var EVENT_AUTOPLAY_PAUSE = "autoplay:pause";
  var EVENT_LAZYLOAD_LOADED = "lazyload:loaded";

  function EventInterface(Splide2) {
    var event = Splide2.event;
    var key = {};
    var listeners = [];

    function on(events, callback, priority) {
      event.on(events, callback, key, priority);
    }

    function off(events) {
      event.off(events, key);
    }

    function bind(targets, events, callback, options) {
      forEachEvent(targets, events, function (target, event2) {
        listeners.push([target, event2, callback, options]);
        target.addEventListener(event2, callback, options);
      });
    }

    function unbind(targets, events, callback) {
      forEachEvent(targets, events, function (target, event2) {
        listeners = listeners.filter(function (listener) {
          if (listener[0] === target && listener[1] === event2 && (!callback || listener[2] === callback)) {
            target.removeEventListener(event2, listener[2], listener[3]);
            return false;
          }

          return true;
        });
      });
    }

    function forEachEvent(targets, events, iteratee) {
      forEach(targets, function (target) {
        if (target) {
          events.split(" ").forEach(iteratee.bind(null, target));
        }
      });
    }

    function destroy() {
      listeners = listeners.filter(function (data) {
        return unbind(data[0], data[1]);
      });
      event.offBy(key);
    }

    event.on(EVENT_DESTROY, destroy, key);
    return {
      on: on,
      off: off,
      emit: event.emit,
      bind: bind,
      unbind: unbind,
      destroy: destroy
    };
  }

  function RequestInterval(interval, onInterval, onUpdate, limit) {
    var now = Date.now;
    var startTime;
    var rate = 0;
    var id;
    var paused = true;
    var count = 0;

    function update() {
      if (!paused) {
        var elapsed = now() - startTime;

        if (elapsed >= interval) {
          rate = 1;
          startTime = now();
        } else {
          rate = elapsed / interval;
        }

        if (onUpdate) {
          onUpdate(rate);
        }

        if (rate === 1) {
          onInterval();

          if (limit && ++count >= limit) {
            return pause();
          }
        }

        raf(update);
      }
    }

    function start(resume) {
      !resume && cancel();
      startTime = now() - (resume ? rate * interval : 0);
      paused = false;
      raf(update);
    }

    function pause() {
      paused = true;
    }

    function rewind() {
      startTime = now();
      rate = 0;

      if (onUpdate) {
        onUpdate(rate);
      }
    }

    function cancel() {
      cancelAnimationFrame(id);
      rate = 0;
      id = 0;
      paused = true;
    }

    function isPaused() {
      return paused;
    }

    return {
      start: start,
      rewind: rewind,
      pause: pause,
      cancel: cancel,
      isPaused: isPaused
    };
  }

  function State(initialState) {
    var state = initialState;

    function set(value) {
      state = value;
    }

    function is(states) {
      return includes(toArray(states), state);
    }

    return {
      set: set,
      is: is
    };
  }

  function Throttle(func, duration) {
    var interval;

    function throttled() {
      var _arguments2 = arguments,
          _this = this;

      if (!interval) {
        interval = RequestInterval(duration || 0, function () {
          func.apply(_this, _arguments2);
          interval = null;
        }, null, 1);
        interval.start();
      }
    }

    return throttled;
  }

  function Options(Splide2, Components2, options) {
    var throttledObserve = Throttle(observe);
    var initialOptions;
    var points;
    var currPoint;

    function setup() {
      try {
        merge(options, JSON.parse(getAttribute(Splide2.root, DATA_ATTRIBUTE)));
      } catch (e) {
        assert(false, e.message);
      }

      initialOptions = merge({}, options);
      var breakpoints = options.breakpoints;

      if (breakpoints) {
        var isMin = options.mediaQuery === "min";
        points = Object.keys(breakpoints).sort(function (n, m) {
          return isMin ? +m - +n : +n - +m;
        }).map(function (point) {
          return [point, matchMedia("(" + (isMin ? "min" : "max") + "-width:" + point + "px)")];
        });
        observe();
      }
    }

    function mount() {
      if (points) {
        addEventListener("resize", throttledObserve);
      }
    }

    function destroy(completely) {
      if (completely) {
        removeEventListener("resize", throttledObserve);
      }
    }

    function observe() {
      var item = find(points, function (item2) {
        return item2[1].matches;
      }) || [];

      if (item[0] !== currPoint) {
        onMatch(currPoint = item[0]);
      }
    }

    function onMatch(point) {
      var newOptions = options.breakpoints[point] || initialOptions;

      if (newOptions.destroy) {
        Splide2.options = initialOptions;
        Splide2.destroy(newOptions.destroy === "completely");
      } else {
        if (Splide2.state.is(DESTROYED)) {
          destroy(true);
          Splide2.mount();
        }

        Splide2.options = newOptions;
      }
    }

    return {
      setup: setup,
      mount: mount,
      destroy: destroy
    };
  }

  var RTL = "rtl";
  var TTB = "ttb";
  var ORIENTATION_MAP = {
    marginRight: ["marginBottom", "marginLeft"],
    autoWidth: ["autoHeight"],
    fixedWidth: ["fixedHeight"],
    paddingLeft: ["paddingTop", "paddingRight"],
    paddingRight: ["paddingBottom", "paddingLeft"],
    width: ["height"],
    left: ["top", "right"],
    right: ["bottom", "left"],
    x: ["y"],
    X: ["Y"],
    Y: ["X"],
    ArrowLeft: ["ArrowUp", "ArrowRight"],
    ArrowRight: ["ArrowDown", "ArrowLeft"]
  };

  function Direction(Splide2, Components2, options) {
    function resolve(prop, axisOnly) {
      var direction = options.direction;
      var index = direction === RTL && !axisOnly ? 1 : direction === TTB ? 0 : -1;
      return ORIENTATION_MAP[prop][index] || prop;
    }

    function orient(value) {
      return value * (options.direction === RTL ? 1 : -1);
    }

    return {
      resolve: resolve,
      orient: orient
    };
  }

  var CLASS_ROOT = PROJECT_CODE;
  var CLASS_SLIDER = PROJECT_CODE + "__slider";
  var CLASS_TRACK = PROJECT_CODE + "__track";
  var CLASS_LIST = PROJECT_CODE + "__list";
  var CLASS_SLIDE = PROJECT_CODE + "__slide";
  var CLASS_CLONE = CLASS_SLIDE + "--clone";
  var CLASS_CONTAINER = CLASS_SLIDE + "__container";
  var CLASS_ARROWS = PROJECT_CODE + "__arrows";
  var CLASS_ARROW = PROJECT_CODE + "__arrow";
  var CLASS_ARROW_PREV = CLASS_ARROW + "--prev";
  var CLASS_ARROW_NEXT = CLASS_ARROW + "--next";
  var CLASS_PAGINATION = PROJECT_CODE + "__pagination";
  var CLASS_PAGINATION_PAGE = CLASS_PAGINATION + "__page";
  var CLASS_PROGRESS = PROJECT_CODE + "__progress";
  var CLASS_PROGRESS_BAR = CLASS_PROGRESS + "__bar";
  var CLASS_AUTOPLAY = PROJECT_CODE + "__autoplay";
  var CLASS_PLAY = PROJECT_CODE + "__play";
  var CLASS_PAUSE = PROJECT_CODE + "__pause";
  var CLASS_SPINNER = PROJECT_CODE + "__spinner";
  var CLASS_INITIALIZED = "is-initialized";
  var CLASS_ACTIVE = "is-active";
  var CLASS_PREV = "is-prev";
  var CLASS_NEXT = "is-next";
  var CLASS_VISIBLE = "is-visible";
  var CLASS_LOADING = "is-loading";
  var STATUS_CLASSES = [CLASS_ACTIVE, CLASS_VISIBLE, CLASS_PREV, CLASS_NEXT, CLASS_LOADING];
  var CLASSES = {
    slide: CLASS_SLIDE,
    clone: CLASS_CLONE,
    arrows: CLASS_ARROWS,
    arrow: CLASS_ARROW,
    prev: CLASS_ARROW_PREV,
    next: CLASS_ARROW_NEXT,
    pagination: CLASS_PAGINATION,
    page: CLASS_PAGINATION_PAGE,
    spinner: CLASS_SPINNER
  };

  function Elements(Splide2, Components2, options) {
    var _EventInterface = EventInterface(Splide2),
        on = _EventInterface.on;

    var root = Splide2.root;
    var elements = {};
    var slides = [];
    var classes;
    var slider;
    var track;
    var list;

    function setup() {
      collect();
      identify();
      addClass(root, classes = getClasses());
    }

    function mount() {
      on(EVENT_REFRESH, refresh, DEFAULT_EVENT_PRIORITY - 2);
      on(EVENT_UPDATED, update);
    }

    function destroy() {
      [root, track, list].forEach(function (elm) {
        removeAttribute(elm, "style");
      });
      empty(slides);
      removeClass(root, classes);
    }

    function refresh() {
      destroy();
      setup();
    }

    function update() {
      removeClass(root, classes);
      addClass(root, classes = getClasses());
    }

    function collect() {
      slider = child(root, "." + CLASS_SLIDER);
      track = query(root, "." + CLASS_TRACK);
      list = child(track, "." + CLASS_LIST);
      assert(track && list, "A track/list element is missing.");
      push(slides, children(list, "." + CLASS_SLIDE + ":not(." + CLASS_CLONE + ")"));
      var autoplay = find("." + CLASS_AUTOPLAY);
      var arrows = find("." + CLASS_ARROWS);
      assign(elements, {
        root: root,
        slider: slider,
        track: track,
        list: list,
        slides: slides,
        arrows: arrows,
        autoplay: autoplay,
        prev: query(arrows, "." + CLASS_ARROW_PREV),
        next: query(arrows, "." + CLASS_ARROW_NEXT),
        bar: query(find("." + CLASS_PROGRESS), "." + CLASS_PROGRESS_BAR),
        play: query(autoplay, "." + CLASS_PLAY),
        pause: query(autoplay, "." + CLASS_PAUSE)
      });
    }

    function identify() {
      var id = root.id || uniqueId(PROJECT_CODE);
      root.id = id;
      track.id = track.id || id + "-track";
      list.id = list.id || id + "-list";
    }

    function find(selector) {
      return child(root, selector) || child(slider, selector);
    }

    function getClasses() {
      return [CLASS_ROOT + "--" + options.type, CLASS_ROOT + "--" + options.direction, options.drag && CLASS_ROOT + "--draggable", options.isNavigation && CLASS_ROOT + "--nav", CLASS_ACTIVE];
    }

    return assign(elements, {
      setup: setup,
      mount: mount,
      destroy: destroy
    });
  }

  var ROLE = "role";
  var ARIA_CONTROLS = "aria-controls";
  var ARIA_CURRENT = "aria-current";
  var ARIA_LABEL = "aria-label";
  var ARIA_HIDDEN = "aria-hidden";
  var TAB_INDEX = "tabindex";
  var DISABLED = "disabled";
  var ARIA_ORIENTATION = "aria-orientation";
  var ALL_ATTRIBUTES = [ROLE, ARIA_CONTROLS, ARIA_CURRENT, ARIA_LABEL, ARIA_HIDDEN, ARIA_ORIENTATION, TAB_INDEX, DISABLED];
  var SLIDE = "slide";
  var LOOP = "loop";
  var FADE = "fade";

  function Slide$1(Splide2, index, slideIndex, slide) {
    var _EventInterface2 = EventInterface(Splide2),
        on = _EventInterface2.on,
        emit = _EventInterface2.emit,
        bind = _EventInterface2.bind,
        destroyEvents = _EventInterface2.destroy;

    var Components = Splide2.Components,
        root = Splide2.root,
        options = Splide2.options;
    var isNavigation = options.isNavigation,
        updateOnMove = options.updateOnMove;
    var resolve = Components.Direction.resolve;
    var styles = getAttribute(slide, "style");
    var isClone = slideIndex > -1;
    var container = child(slide, "." + CLASS_CONTAINER);
    var focusableNodes = options.focusableNodes && queryAll(slide, options.focusableNodes);
    var destroyed;

    function mount() {
      var _this2 = this;

      init();
      bind(slide, "click keydown", function (e) {
        emit(e.type === "click" ? EVENT_CLICK : EVENT_SLIDE_KEYDOWN, _this2, e);
      });
      on([EVENT_REFRESH, EVENT_REPOSITIONED, EVENT_MOVED, EVENT_SCROLLED], update.bind(this));

      if (updateOnMove) {
        on(EVENT_MOVE, onMove.bind(this));
      }
    }

    function init() {
      if (!isClone) {
        slide.id = root.id + "-slide" + pad(index + 1);
      }

      if (isNavigation) {
        var idx = isClone ? slideIndex : index;
        var label = format(options.i18n.slideX, idx + 1);
        var controls = Splide2.splides.map(function (splide) {
          return splide.root.id;
        }).join(" ");
        setAttribute(slide, ARIA_LABEL, label);
        setAttribute(slide, ARIA_CONTROLS, controls);
        setAttribute(slide, ROLE, "menuitem");
      }
    }

    function destroy() {
      destroyed = true;
      destroyEvents();
      removeClass(slide, STATUS_CLASSES);
      removeAttribute(slide, ALL_ATTRIBUTES);
      setAttribute(slide, "style", styles);
    }

    function onMove(next, prev, dest) {
      if (!destroyed) {
        update.call(this);

        if (dest === index) {
          updateActivity.call(this, true);
        }
      }
    }

    function update() {
      if (!destroyed) {
        var currIndex = Splide2.index;
        updateActivity.call(this, isActive());
        updateVisibility.call(this, isVisible());
        toggleClass(slide, CLASS_PREV, index === currIndex - 1);
        toggleClass(slide, CLASS_NEXT, index === currIndex + 1);
      }
    }

    function updateActivity(active) {
      if (active !== hasClass(slide, CLASS_ACTIVE)) {
        toggleClass(slide, CLASS_ACTIVE, active);

        if (isNavigation) {
          setAttribute(slide, ARIA_CURRENT, active || null);
        }

        emit(active ? EVENT_ACTIVE : EVENT_INACTIVE, this);
      }
    }

    function updateVisibility(visible) {
      var ariaHidden = !visible && !isActive();
      setAttribute(slide, ARIA_HIDDEN, ariaHidden || null);
      setAttribute(slide, TAB_INDEX, !ariaHidden && options.slideFocus ? 0 : null);

      if (focusableNodes) {
        focusableNodes.forEach(function (node) {
          setAttribute(node, TAB_INDEX, ariaHidden ? -1 : null);
        });
      }

      if (visible !== hasClass(slide, CLASS_VISIBLE)) {
        toggleClass(slide, CLASS_VISIBLE, visible);
        emit(visible ? EVENT_VISIBLE : EVENT_HIDDEN, this);
      }
    }

    function style$1(prop, value, useContainer) {
      style(useContainer && container || slide, prop, value);
    }

    function isActive() {
      return Splide2.index === index;
    }

    function isVisible() {
      if (Splide2.is(FADE)) {
        return isActive();
      }

      var trackRect = rect(Components.Elements.track);
      var slideRect = rect(slide);
      var left = resolve("left");
      var right = resolve("right");
      return floor(trackRect[left]) <= ceil(slideRect[left]) && floor(slideRect[right]) <= ceil(trackRect[right]);
    }

    function isWithin(from, distance) {
      var diff = abs(from - index);

      if (!Splide2.is(SLIDE) && !isClone) {
        diff = min(diff, Splide2.length - diff);
      }

      return diff <= distance;
    }

    return {
      index: index,
      slideIndex: slideIndex,
      slide: slide,
      container: container,
      isClone: isClone,
      mount: mount,
      destroy: destroy,
      style: style$1,
      isWithin: isWithin
    };
  }

  function Slides(Splide2, Components2, options) {
    var _EventInterface3 = EventInterface(Splide2),
        on = _EventInterface3.on,
        emit = _EventInterface3.emit,
        bind = _EventInterface3.bind;

    var _Components2$Elements = Components2.Elements,
        slides = _Components2$Elements.slides,
        list = _Components2$Elements.list;
    var Slides2 = [];

    function mount() {
      init();
      on(EVENT_REFRESH, refresh);
      on([EVENT_MOUNTED, EVENT_REFRESH], function () {
        Slides2.sort(function (Slide1, Slide2) {
          return Slide1.index - Slide2.index;
        });
      });
    }

    function init() {
      slides.forEach(function (slide, index) {
        register(slide, index, -1);
      });
    }

    function destroy() {
      forEach$1(function (Slide2) {
        Slide2.destroy();
      });
      empty(Slides2);
    }

    function refresh() {
      destroy();
      init();
    }

    function register(slide, index, slideIndex) {
      var object = Slide$1(Splide2, index, slideIndex, slide);
      object.mount();
      Slides2.push(object);
    }

    function get(excludeClones) {
      return excludeClones ? filter(function (Slide2) {
        return !Slide2.isClone;
      }) : Slides2;
    }

    function getIn(page) {
      var Controller = Components2.Controller;
      var index = Controller.toIndex(page);
      var max = Controller.hasFocus() ? 1 : options.perPage;
      return filter(function (Slide2) {
        return between(Slide2.index, index, index + max - 1);
      });
    }

    function getAt(index) {
      return filter(index)[0];
    }

    function add(items, index) {
      forEach(items, function (slide) {
        if (isString(slide)) {
          slide = parseHtml(slide);
        }

        if (isHTMLElement(slide)) {
          var ref = slides[index];
          ref ? before(slide, ref) : append(list, slide);
          addClass(slide, options.classes.slide);
          observeImages(slide, emit.bind(null, EVENT_RESIZE));
        }
      });
      emit(EVENT_REFRESH);
    }

    function remove$1(matcher) {
      remove(filter(matcher).map(function (Slide2) {
        return Slide2.slide;
      }));
      emit(EVENT_REFRESH);
    }

    function forEach$1(iteratee, excludeClones) {
      get(excludeClones).forEach(iteratee);
    }

    function filter(matcher) {
      return Slides2.filter(isFunction(matcher) ? matcher : function (Slide2) {
        return isString(matcher) ? matches(Slide2.slide, matcher) : includes(toArray(matcher), Slide2.index);
      });
    }

    function style(prop, value, useContainer) {
      forEach$1(function (Slide2) {
        Slide2.style(prop, value, useContainer);
      });
    }

    function observeImages(elm, callback) {
      var images = queryAll(elm, "img");
      var length = images.length;

      if (length) {
        images.forEach(function (img) {
          bind(img, "load error", function () {
            if (! --length) {
              callback();
            }
          });
        });
      } else {
        callback();
      }
    }

    function getLength(excludeClones) {
      return excludeClones ? slides.length : Slides2.length;
    }

    function isEnough() {
      return Slides2.length > options.perPage;
    }

    return {
      mount: mount,
      destroy: destroy,
      register: register,
      get: get,
      getIn: getIn,
      getAt: getAt,
      add: add,
      remove: remove$1,
      forEach: forEach$1,
      filter: filter,
      style: style,
      getLength: getLength,
      isEnough: isEnough
    };
  }

  function Layout(Splide2, Components2, options) {
    var _EventInterface4 = EventInterface(Splide2),
        on = _EventInterface4.on,
        bind = _EventInterface4.bind,
        emit = _EventInterface4.emit;

    var Slides = Components2.Slides;
    var resolve = Components2.Direction.resolve;
    var _Components2$Elements2 = Components2.Elements,
        track = _Components2$Elements2.track,
        list = _Components2$Elements2.list;
    var getAt = Slides.getAt;
    var vertical;

    function mount() {
      init();
      bind(window, "resize load", Throttle(emit.bind(this, EVENT_RESIZE)));
      on([EVENT_UPDATED, EVENT_REFRESH], init);
      on(EVENT_RESIZE, resize);
    }

    function init() {
      vertical = options.direction === TTB;
      style(Splide2.root, "maxWidth", unit(options.width));
      style(track, resolve("paddingLeft"), cssPadding(false));
      style(track, resolve("paddingRight"), cssPadding(true));
      resize();
    }

    function resize() {
      style(track, "height", cssTrackHeight());
      Slides.style(resolve("marginRight"), unit(options.gap));
      Slides.style("width", cssSlideWidth() || null);
      setSlidesHeight();
      emit(EVENT_RESIZED);
    }

    function setSlidesHeight() {
      Slides.style("height", cssSlideHeight() || null, true);
    }

    function cssPadding(right) {
      var padding = options.padding;
      var prop = resolve(right ? "right" : "left", true);
      return padding && unit(padding[prop] || (isObject(padding) ? 0 : padding)) || "0px";
    }

    function cssTrackHeight() {
      var height = "";

      if (vertical) {
        height = cssHeight();
        assert(height, "height or heightRatio is missing.");
        height = "calc(" + height + " - " + cssPadding(false) + " - " + cssPadding(true) + ")";
      }

      return height;
    }

    function cssHeight() {
      return unit(options.height || rect(list).width * options.heightRatio);
    }

    function cssSlideWidth() {
      return options.autoWidth ? "" : unit(options.fixedWidth) || (vertical ? "" : cssSlideSize());
    }

    function cssSlideHeight() {
      return unit(options.fixedHeight) || (vertical ? options.autoHeight ? "" : cssSlideSize() : cssHeight());
    }

    function cssSlideSize() {
      var gap = unit(options.gap);
      return "calc((100%" + (gap && " + " + gap) + ")/" + (options.perPage || 1) + (gap && " - " + gap) + ")";
    }

    function listSize() {
      return rect(list)[resolve("width")];
    }

    function slideSize(index, withoutGap) {
      var Slide = getAt(index || 0);
      return Slide ? rect(Slide.slide)[resolve("width")] + (withoutGap ? 0 : getGap()) : 0;
    }

    function totalSize(index, withoutGap) {
      var Slide = getAt(index);

      if (Slide) {
        var right = rect(Slide.slide)[resolve("right")];
        var left = rect(list)[resolve("left")];
        return abs(right - left) + (withoutGap ? 0 : getGap());
      }

      return 0;
    }

    function sliderSize() {
      return totalSize(Splide2.length - 1, true) - totalSize(-1, true);
    }

    function getGap() {
      var Slide = getAt(0);
      return Slide && parseFloat(style(Slide.slide, resolve("marginRight"))) || 0;
    }

    function getPadding(right) {
      return parseFloat(style(track, resolve("padding" + (right ? "Right" : "Left"), true))) || 0;
    }

    return {
      mount: mount,
      listSize: listSize,
      slideSize: slideSize,
      sliderSize: sliderSize,
      totalSize: totalSize,
      getPadding: getPadding
    };
  }

  function Clones(Splide2, Components2, options) {
    var _EventInterface5 = EventInterface(Splide2),
        on = _EventInterface5.on,
        emit = _EventInterface5.emit;

    var Elements = Components2.Elements,
        Slides = Components2.Slides;
    var resolve = Components2.Direction.resolve;
    var clones = [];
    var cloneCount;

    function mount() {
      init();
      on(EVENT_REFRESH, refresh);
      on([EVENT_UPDATED, EVENT_RESIZE], observe);
    }

    function init() {
      if (cloneCount = computeCloneCount()) {
        generate(cloneCount);
        emit(EVENT_RESIZE);
      }
    }

    function destroy() {
      remove(clones);
      empty(clones);
    }

    function refresh() {
      destroy();
      init();
    }

    function observe() {
      if (cloneCount < computeCloneCount()) {
        emit(EVENT_REFRESH);
      }
    }

    function generate(count) {
      var slides = Slides.get().slice();
      var length = slides.length;

      if (length) {
        while (slides.length < count) {
          push(slides, slides);
        }

        push(slides.slice(-count), slides.slice(0, count)).forEach(function (Slide, index) {
          var isHead = index < count;
          var clone = cloneDeep(Slide.slide, index);
          isHead ? before(clone, slides[0].slide) : append(Elements.list, clone);
          push(clones, clone);
          Slides.register(clone, index - count + (isHead ? 0 : length), Slide.index);
        });
      }
    }

    function cloneDeep(elm, index) {
      var clone = elm.cloneNode(true);
      addClass(clone, options.classes.clone);
      clone.id = Splide2.root.id + "-clone" + pad(index + 1);
      return clone;
    }

    function computeCloneCount() {
      var clones2 = options.clones;

      if (!Splide2.is(LOOP)) {
        clones2 = 0;
      } else if (!clones2) {
        var fixedSize = measure(Elements.list, options[resolve("fixedWidth")]);
        var fixedCount = fixedSize && ceil(rect(Elements.track)[resolve("width")] / fixedSize);
        var baseCount = fixedCount || options[resolve("autoWidth")] && Splide2.length || options.perPage;
        clones2 = baseCount * (options.drag ? (options.flickMaxPages || 1) + 1 : 2);
      }

      return clones2;
    }

    return {
      mount: mount,
      destroy: destroy
    };
  }

  function Move(Splide2, Components2, options) {
    var _EventInterface6 = EventInterface(Splide2),
        on = _EventInterface6.on,
        emit = _EventInterface6.emit;

    var _Components2$Layout = Components2.Layout,
        slideSize = _Components2$Layout.slideSize,
        getPadding = _Components2$Layout.getPadding,
        totalSize = _Components2$Layout.totalSize,
        listSize = _Components2$Layout.listSize,
        sliderSize = _Components2$Layout.sliderSize;
    var _Components2$Directio = Components2.Direction,
        resolve = _Components2$Directio.resolve,
        orient = _Components2$Directio.orient;
    var _Components2$Elements3 = Components2.Elements,
        list = _Components2$Elements3.list,
        track = _Components2$Elements3.track;
    var waiting;

    function mount() {
      on([EVENT_MOUNTED, EVENT_RESIZED, EVENT_UPDATED, EVENT_REFRESH], reposition);
    }

    function destroy() {
      removeAttribute(list, "style");
    }

    function reposition() {
      Components2.Scroll.cancel();
      jump(Splide2.index);
      emit(EVENT_REPOSITIONED);
    }

    function move(dest, index, prev, callback) {
      if (!isBusy()) {
        var set = Splide2.state.set;
        var position = getPosition();
        var looping = dest !== index;
        waiting = looping || options.waitForTransition;
        set(MOVING);
        emit(EVENT_MOVE, index, prev, dest);
        Components2.Transition.start(dest, function () {
          looping && jump(index);
          waiting = false;
          set(IDLE);
          emit(EVENT_MOVED, index, prev, dest);

          if (options.trimSpace === "move" && dest !== prev && position === getPosition()) {
            Components2.Controller.go(dest > prev ? ">" : "<", false, callback);
          } else {
            callback && callback();
          }
        });
      }
    }

    function jump(index) {
      translate(toPosition(index, true));
    }

    function translate(position, preventLoop) {
      if (!Splide2.is(FADE)) {
        list.style.transform = "translate" + resolve("X") + "(" + (preventLoop ? position : loop(position)) + "px)";
      }
    }

    function loop(position) {
      if (!waiting && Splide2.is(LOOP)) {
        var diff = orient(position - getPosition());
        var exceededMin = exceededLimit(false, position) && diff < 0;
        var exceededMax = exceededLimit(true, position) && diff > 0;

        if (exceededMin || exceededMax) {
          position = shift(position, exceededMax);
        }
      }

      return position;
    }

    function shift(position, backwards) {
      var excess = position - getLimit(backwards);
      var size = sliderSize();
      position -= sign(excess) * size * ceil(abs(excess) / size);
      return position;
    }

    function cancel() {
      waiting = false;
      translate(getPosition());
      Components2.Transition.cancel();
    }

    function toIndex(position) {
      var Slides = Components2.Slides.get();
      var index = 0;
      var minDistance = Infinity;

      for (var i = 0; i < Slides.length; i++) {
        var slideIndex = Slides[i].index;
        var distance = abs(toPosition(slideIndex, true) - position);

        if (distance <= minDistance) {
          minDistance = distance;
          index = slideIndex;
        } else {
          break;
        }
      }

      return index;
    }

    function toPosition(index, trimming) {
      var position = orient(totalSize(index - 1) - offset(index));
      return trimming ? trim(position) : position;
    }

    function getPosition() {
      var left = resolve("left");
      return rect(list)[left] - rect(track)[left] + orient(getPadding(false));
    }

    function trim(position) {
      if (options.trimSpace && Splide2.is(SLIDE)) {
        position = clamp(position, 0, orient(sliderSize() - listSize()));
      }

      return position;
    }

    function offset(index) {
      var focus = options.focus;
      return focus === "center" ? (listSize() - slideSize(index, true)) / 2 : +focus * slideSize(index) || 0;
    }

    function getLimit(max) {
      return toPosition(max ? Components2.Controller.getEnd() : 0, !!options.trimSpace);
    }

    function isBusy() {
      return !!waiting;
    }

    function exceededLimit(max, position) {
      position = isUndefined(position) ? getPosition() : position;
      var exceededMin = max !== true && orient(position) < orient(getLimit(false));
      var exceededMax = max !== false && orient(position) > orient(getLimit(true));
      return exceededMin || exceededMax;
    }

    return {
      mount: mount,
      destroy: destroy,
      move: move,
      jump: jump,
      translate: translate,
      shift: shift,
      cancel: cancel,
      toIndex: toIndex,
      toPosition: toPosition,
      getPosition: getPosition,
      getLimit: getLimit,
      isBusy: isBusy,
      exceededLimit: exceededLimit
    };
  }

  function Controller(Splide2, Components2, options) {
    var _EventInterface7 = EventInterface(Splide2),
        on = _EventInterface7.on;

    var Move = Components2.Move;
    var getPosition = Move.getPosition,
        getLimit = Move.getLimit;
    var _Components2$Slides = Components2.Slides,
        isEnough = _Components2$Slides.isEnough,
        getLength = _Components2$Slides.getLength;
    var isLoop = Splide2.is(LOOP);
    var isSlide = Splide2.is(SLIDE);
    var currIndex = options.start || 0;
    var prevIndex = currIndex;
    var slideCount;
    var perMove;
    var perPage;

    function mount() {
      init();
      on([EVENT_UPDATED, EVENT_REFRESH], init, DEFAULT_EVENT_PRIORITY - 1);
    }

    function init() {
      slideCount = getLength(true);
      perMove = options.perMove;
      perPage = options.perPage;
      currIndex = clamp(currIndex, 0, slideCount - 1);
    }

    function go(control, allowSameIndex, callback) {
      var dest = parse(control);

      if (options.useScroll) {
        scroll(dest, true, true, options.speed, callback);
      } else {
        var index = loop(dest);

        if (index > -1 && !Move.isBusy() && (allowSameIndex || index !== currIndex)) {
          setIndex(index);
          Move.move(dest, index, prevIndex, callback);
        }
      }
    }

    function scroll(destination, useIndex, snap, duration, callback) {
      var dest = useIndex ? destination : toDest(destination);
      Components2.Scroll.scroll(useIndex || snap ? Move.toPosition(dest, true) : destination, duration, function () {
        setIndex(Move.toIndex(Move.getPosition()));
        callback && callback();
      });
    }

    function parse(control) {
      var index = currIndex;

      if (isString(control)) {
        var _ref = control.match(/([+\-<>])(\d+)?/) || [],
            indicator = _ref[1],
            number = _ref[2];

        if (indicator === "+" || indicator === "-") {
          index = computeDestIndex(currIndex + +("" + indicator + (+number || 1)), currIndex, true);
        } else if (indicator === ">") {
          index = number ? toIndex(+number) : getNext(true);
        } else if (indicator === "<") {
          index = getPrev(true);
        }
      } else {
        if (isLoop) {
          index = clamp(control, -perPage, slideCount + perPage - 1);
        } else {
          index = clamp(control, 0, getEnd());
        }
      }

      return index;
    }

    function getNext(destination) {
      return getAdjacent(false, destination);
    }

    function getPrev(destination) {
      return getAdjacent(true, destination);
    }

    function getAdjacent(prev, destination) {
      var number = perMove || hasFocus() ? 1 : perPage;
      var dest = computeDestIndex(currIndex + number * (prev ? -1 : 1), currIndex);

      if (dest === -1 && isSlide) {
        if (!approximatelyEqual(getPosition(), getLimit(!prev), 1)) {
          return prev ? 0 : getEnd();
        }
      }

      return destination ? dest : loop(dest);
    }

    function computeDestIndex(dest, from, incremental) {
      if (isEnough()) {
        var end = getEnd();

        if (dest < 0 || dest > end) {
          if (between(0, dest, from, true) || between(end, from, dest, true)) {
            dest = toIndex(toPage(dest));
          } else {
            if (isLoop) {
              dest = perMove ? dest : dest < 0 ? -(slideCount % perPage || perPage) : slideCount;
            } else if (options.rewind) {
              dest = dest < 0 ? end : 0;
            } else {
              dest = -1;
            }
          }
        } else {
          if (!isLoop && !incremental && dest !== from) {
            dest = perMove ? dest : toIndex(toPage(from) + (dest < from ? -1 : 1));
          }
        }
      } else {
        dest = -1;
      }

      return dest;
    }

    function getEnd() {
      var end = slideCount - perPage;

      if (hasFocus() || isLoop && perMove) {
        end = slideCount - 1;
      }

      return max(end, 0);
    }

    function loop(index) {
      if (isLoop) {
        return isEnough() ? index % slideCount + (index < 0 ? slideCount : 0) : -1;
      }

      return index;
    }

    function toIndex(page) {
      return clamp(hasFocus() ? page : perPage * page, 0, getEnd());
    }

    function toPage(index) {
      if (!hasFocus()) {
        index = between(index, slideCount - perPage, slideCount - 1) ? slideCount - 1 : index;
        index = floor(index / perPage);
      }

      return index;
    }

    function toDest(destination) {
      var closest = Move.toIndex(destination);
      return isSlide ? clamp(closest, 0, getEnd()) : closest;
    }

    function setIndex(index) {
      if (index !== currIndex) {
        prevIndex = currIndex;
        currIndex = index;
      }
    }

    function getIndex(prev) {
      return prev ? prevIndex : currIndex;
    }

    function hasFocus() {
      return !isUndefined(options.focus) || options.isNavigation;
    }

    return {
      mount: mount,
      go: go,
      scroll: scroll,
      getNext: getNext,
      getPrev: getPrev,
      getEnd: getEnd,
      setIndex: setIndex,
      getIndex: getIndex,
      toIndex: toIndex,
      toPage: toPage,
      toDest: toDest,
      hasFocus: hasFocus
    };
  }

  var XML_NAME_SPACE = "http://www.w3.org/2000/svg";
  var PATH = "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z";
  var SIZE = 40;

  function Arrows(Splide2, Components2, options) {
    var _EventInterface8 = EventInterface(Splide2),
        on = _EventInterface8.on,
        bind = _EventInterface8.bind,
        emit = _EventInterface8.emit;

    var classes = options.classes,
        i18n = options.i18n;
    var Elements = Components2.Elements,
        Controller = Components2.Controller;
    var wrapper = Elements.arrows;
    var prev = Elements.prev;
    var next = Elements.next;
    var created;
    var arrows = {};

    function mount() {
      init();
      on(EVENT_UPDATED, init);
    }

    function init() {
      if (options.arrows) {
        if (!prev || !next) {
          createArrows();
        }
      }

      if (prev && next) {
        if (!arrows.prev) {
          var id = Elements.track.id;
          setAttribute(prev, ARIA_CONTROLS, id);
          setAttribute(next, ARIA_CONTROLS, id);
          arrows.prev = prev;
          arrows.next = next;
          listen();
          emit(EVENT_ARROWS_MOUNTED, prev, next);
        } else {
          display(wrapper, options.arrows === false ? "none" : "");
        }
      }
    }

    function destroy() {
      if (created) {
        remove(wrapper);
      } else {
        removeAttribute(prev, ALL_ATTRIBUTES);
        removeAttribute(next, ALL_ATTRIBUTES);
      }
    }

    function listen() {
      var go = Controller.go;
      on([EVENT_MOUNTED, EVENT_MOVED, EVENT_UPDATED, EVENT_REFRESH, EVENT_SCROLLED], update);
      bind(next, "click", function () {
        go(">", true);
      });
      bind(prev, "click", function () {
        go("<", true);
      });
    }

    function createArrows() {
      wrapper = create("div", classes.arrows);
      prev = createArrow(true);
      next = createArrow(false);
      created = true;
      append(wrapper, [prev, next]);
      before(wrapper, child(options.arrows === "slider" && Elements.slider || Splide2.root));
    }

    function createArrow(prev2) {
      var arrow = "<button class=\"" + classes.arrow + " " + (prev2 ? classes.prev : classes.next) + "\" type=\"button\"><svg xmlns=\"" + XML_NAME_SPACE + "\" viewBox=\"0 0 " + SIZE + " " + SIZE + "\" width=\"" + SIZE + "\" height=\"" + SIZE + "\"><path d=\"" + (options.arrowPath || PATH) + "\" />";
      return parseHtml(arrow);
    }

    function update() {
      var index = Splide2.index;
      var prevIndex = Controller.getPrev();
      var nextIndex = Controller.getNext();
      var prevLabel = prevIndex > -1 && index < prevIndex ? i18n.last : i18n.prev;
      var nextLabel = nextIndex > -1 && index > nextIndex ? i18n.first : i18n.next;
      prev.disabled = prevIndex < 0;
      next.disabled = nextIndex < 0;
      setAttribute(prev, ARIA_LABEL, prevLabel);
      setAttribute(next, ARIA_LABEL, nextLabel);
      emit(EVENT_ARROWS_UPDATED, prev, next, prevIndex, nextIndex);
    }

    return {
      arrows: arrows,
      mount: mount,
      destroy: destroy
    };
  }

  function Autoplay(Splide2, Components2, options) {
    var _EventInterface9 = EventInterface(Splide2),
        on = _EventInterface9.on,
        bind = _EventInterface9.bind,
        emit = _EventInterface9.emit;

    var Elements = Components2.Elements;
    var interval = RequestInterval(options.interval, Splide2.go.bind(Splide2, ">"), update);
    var isPaused = interval.isPaused;
    var hovered;
    var focused;
    var paused;

    function mount() {
      var autoplay = options.autoplay;

      if (autoplay) {
        initButton(true);
        initButton(false);
        listen();

        if (autoplay !== "pause") {
          play();
        }
      }
    }

    function initButton(forPause) {
      var prop = forPause ? "pause" : "play";
      var button = Elements[prop];

      if (button) {
        setAttribute(button, ARIA_CONTROLS, Elements.track.id);
        setAttribute(button, ARIA_LABEL, options.i18n[prop]);
        bind(button, "click", forPause ? pause : play);
      }
    }

    function listen() {
      var root = Elements.root;

      if (options.pauseOnHover) {
        bind(root, "mouseenter mouseleave", function (e) {
          hovered = e.type === "mouseenter";
          autoToggle();
        });
      }

      if (options.pauseOnFocus) {
        bind(root, "focusin focusout", function (e) {
          focused = e.type === "focusin";
          autoToggle();
        });
      }

      on([EVENT_MOVE, EVENT_SCROLL, EVENT_REFRESH], interval.rewind);
    }

    function play() {
      if (isPaused() && Components2.Slides.isEnough()) {
        interval.start(!options.resetProgress);
        focused = hovered = paused = false;
        emit(EVENT_AUTOPLAY_PLAY);
      }
    }

    function pause(manual) {
      if (manual === void 0) {
        manual = true;
      }

      if (!isPaused()) {
        interval.pause();
        emit(EVENT_AUTOPLAY_PAUSE);
      }

      paused = manual;
    }

    function autoToggle() {
      if (!paused) {
        if (!hovered && !focused) {
          play();
        } else {
          pause(false);
        }
      }
    }

    function update(rate) {
      var bar = Elements.bar;

      if (bar) {
        style(bar, "width", rate * 100 + "%");
      }

      emit(EVENT_AUTOPLAY_PLAYING, rate);
    }

    return {
      mount: mount,
      destroy: interval.cancel,
      play: play,
      pause: pause,
      isPaused: isPaused
    };
  }

  function Cover(Splide2, Components2, options) {
    var _EventInterface10 = EventInterface(Splide2),
        on = _EventInterface10.on;

    function mount() {
      if (options.cover) {
        on(EVENT_LAZYLOAD_LOADED, function (img, Slide) {
          toggle(true, img, Slide);
        });
        on([EVENT_MOUNTED, EVENT_UPDATED, EVENT_REFRESH], apply.bind(null, true));
      }
    }

    function destroy() {
      apply(false);
    }

    function apply(cover) {
      Components2.Slides.forEach(function (Slide) {
        var img = child(Slide.container || Slide.slide, "img");

        if (img && img.src) {
          toggle(cover, img, Slide);
        }
      });
    }

    function toggle(cover, img, Slide) {
      Slide.style("background", cover ? "center/cover no-repeat url(\"" + img.src + "\")" : "", true);
      display(img, cover ? "none" : "");
    }

    return {
      mount: mount,
      destroy: destroy
    };
  }

  var BOUNCE_DIFF_THRESHOLD = 10;
  var BOUNCE_DURATION = 600;
  var FRICTION_FACTOR = 0.6;
  var BASE_VELOCITY = 1.5;
  var MIN_DURATION = 800;

  function Scroll(Splide2, Components2, options) {
    var _EventInterface11 = EventInterface(Splide2),
        on = _EventInterface11.on,
        emit = _EventInterface11.emit;

    var Move = Components2.Move;
    var getPosition = Move.getPosition,
        getLimit = Move.getLimit,
        exceededLimit = Move.exceededLimit;
    var interval;
    var scrollCallback;

    function mount() {
      on(EVENT_MOVE, clear);
      on([EVENT_UPDATED, EVENT_REFRESH], cancel);
    }

    function scroll(destination, duration, callback, suppressConstraint) {
      var start = getPosition();
      var friction = 1;
      duration = duration || computeDuration(abs(destination - start));
      scrollCallback = callback;
      clear();
      interval = RequestInterval(duration, onScrolled, function (rate) {
        var position = getPosition();
        var target = start + (destination - start) * easing(rate);
        var diff = (target - getPosition()) * friction;
        Move.translate(position + diff);

        if (Splide2.is(SLIDE) && !suppressConstraint && exceededLimit()) {
          friction *= FRICTION_FACTOR;

          if (abs(diff) < BOUNCE_DIFF_THRESHOLD) {
            bounce(exceededLimit(false));
          }
        }
      }, 1);
      emit(EVENT_SCROLL);
      interval.start();
    }

    function bounce(backwards) {
      scroll(getLimit(!backwards), BOUNCE_DURATION, null, true);
    }

    function onScrolled() {
      var position = getPosition();
      var index = Move.toIndex(position);

      if (!between(index, 0, Splide2.length - 1)) {
        Move.translate(Move.shift(position, index > 0), true);
      }

      scrollCallback && scrollCallback();
      emit(EVENT_SCROLLED);
    }

    function computeDuration(distance) {
      return max(distance / BASE_VELOCITY, MIN_DURATION);
    }

    function clear() {
      if (interval) {
        interval.cancel();
      }
    }

    function cancel() {
      if (interval && !interval.isPaused()) {
        clear();
        onScrolled();
      }
    }

    function easing(t) {
      var easingFunc = options.easingFunc;
      return easingFunc ? easingFunc(t) : 1 - Math.pow(1 - t, 4);
    }

    return {
      mount: mount,
      destroy: clear,
      scroll: scroll,
      cancel: cancel
    };
  }

  var FRICTION = 5;
  var LOG_INTERVAL = 200;
  var POINTER_DOWN_EVENTS = "touchstart mousedown";
  var POINTER_MOVE_EVENTS = "touchmove mousemove";
  var POINTER_UP_EVENTS = "touchend touchcancel mouseup";

  function Drag(Splide2, Components2, options) {
    var _EventInterface12 = EventInterface(Splide2),
        on = _EventInterface12.on,
        emit = _EventInterface12.emit,
        bind = _EventInterface12.bind,
        unbind = _EventInterface12.unbind;

    var Move = Components2.Move,
        Scroll = Components2.Scroll,
        Controller = Components2.Controller;
    var track = Components2.Elements.track;
    var _Components2$Directio2 = Components2.Direction,
        resolve = _Components2$Directio2.resolve,
        orient = _Components2$Directio2.orient;
    var getPosition = Move.getPosition,
        exceededLimit = Move.exceededLimit;
    var listenerOptions = {
      passive: false,
      capture: true
    };
    var basePosition;
    var baseEvent;
    var prevBaseEvent;
    var lastEvent;
    var isFree;
    var isDragging;
    var hasExceeded = false;
    var clickPrevented;
    var disabled;
    var target;

    function mount() {
      bind(track, POINTER_MOVE_EVENTS, noop, listenerOptions);
      bind(track, POINTER_UP_EVENTS, noop, listenerOptions);
      bind(track, POINTER_DOWN_EVENTS, onPointerDown, listenerOptions);
      bind(track, "click", onClick, {
        capture: true
      });
      bind(track, "dragstart", prevent);
      on([EVENT_MOUNTED, EVENT_UPDATED], init);
    }

    function init() {
      var drag = options.drag;
      disable(!drag);
      isFree = drag === "free";
    }

    function onPointerDown(e) {
      if (!disabled) {
        var isTouch = isTouchEvent(e);

        if (isTouch || !e.button) {
          if (!Move.isBusy()) {
            target = isTouch ? track : window;
            prevBaseEvent = null;
            lastEvent = null;
            clickPrevented = false;
            bind(target, POINTER_MOVE_EVENTS, onPointerMove, listenerOptions);
            bind(target, POINTER_UP_EVENTS, onPointerUp, listenerOptions);
            Move.cancel();
            Scroll.cancel();
            save(e);
          } else {
            prevent(e, true);
          }
        }
      }
    }

    function onPointerMove(e) {
      if (!lastEvent) {
        emit(EVENT_DRAG);
      }

      lastEvent = e;

      if (e.cancelable) {
        if (isDragging) {
          var expired = timeOf(e) - timeOf(baseEvent) > LOG_INTERVAL;
          var exceeded = hasExceeded !== (hasExceeded = exceededLimit());

          if (expired || exceeded) {
            save(e);
          }

          Move.translate(basePosition + constrain(coordOf(e) - coordOf(baseEvent)));
          emit(EVENT_DRAGGING);
          clickPrevented = true;
          prevent(e);
        } else {
          var diff = abs(coordOf(e) - coordOf(baseEvent));
          var thresholds = options.dragMinThreshold;
          thresholds = isObject(thresholds) ? thresholds : {
            mouse: 0,
            touch: +thresholds || 10
          };
          isDragging = diff > (isTouchEvent(e) ? thresholds.touch : thresholds.mouse);

          if (isSliderDirection()) {
            prevent(e);
          }
        }
      }
    }

    function onPointerUp(e) {
      unbind(target, POINTER_MOVE_EVENTS, onPointerMove);
      unbind(target, POINTER_UP_EVENTS, onPointerUp);

      if (lastEvent) {
        if (isDragging || e.cancelable && isSliderDirection()) {
          var velocity = computeVelocity(e);
          var destination = computeDestination(velocity);

          if (isFree) {
            Controller.scroll(destination);
          } else if (Splide2.is(FADE)) {
            Controller.go(Splide2.index + orient(sign(velocity)));
          } else {
            Controller.go(Controller.toDest(destination), true);
          }

          prevent(e);
        }

        emit(EVENT_DRAGGED);
      }

      isDragging = false;
    }

    function save(e) {
      prevBaseEvent = baseEvent;
      baseEvent = e;
      basePosition = getPosition();
    }

    function onClick(e) {
      if (!disabled && clickPrevented) {
        prevent(e, true);
      }
    }

    function isSliderDirection() {
      var diffX = abs(coordOf(lastEvent) - coordOf(baseEvent));
      var diffY = abs(coordOf(lastEvent, true) - coordOf(baseEvent, true));
      return diffX > diffY;
    }

    function computeVelocity(e) {
      if (Splide2.is(LOOP) || !hasExceeded) {
        var base = baseEvent === lastEvent && prevBaseEvent || baseEvent;
        var diffCoord = coordOf(lastEvent) - coordOf(base);
        var diffTime = timeOf(e) - timeOf(base);
        var isFlick = timeOf(e) - timeOf(lastEvent) < LOG_INTERVAL;

        if (diffTime && isFlick) {
          return diffCoord / diffTime;
        }
      }

      return 0;
    }

    function computeDestination(velocity) {
      return getPosition() + sign(velocity) * min(abs(velocity) * (options.flickPower || 600), isFree ? Infinity : Components2.Layout.listSize() * (options.flickMaxPages || 1));
    }

    function coordOf(e, orthogonal) {
      return (isTouchEvent(e) ? e.touches[0] : e)["page" + resolve(orthogonal ? "Y" : "X")];
    }

    function isTouchEvent(e) {
      return typeof TouchEvent !== "undefined" && e instanceof TouchEvent;
    }

    function timeOf(e) {
      return e.timeStamp;
    }

    function constrain(diff) {
      return diff / (hasExceeded && Splide2.is(SLIDE) ? FRICTION : 1);
    }

    function disable(value) {
      disabled = value;
    }

    return {
      mount: mount,
      disable: disable
    };
  }

  var IE_ARROW_KEYS = ["Left", "Right", "Up", "Down"];

  function Keyboard(Splide2, Components2, options) {
    var _EventInterface13 = EventInterface(Splide2),
        on = _EventInterface13.on,
        bind = _EventInterface13.bind,
        unbind = _EventInterface13.unbind;

    var root = Components2.Elements.root;
    var resolve = Components2.Direction.resolve;
    var target;

    function mount() {
      init();
      on(EVENT_UPDATED, function () {
        destroy();
        init();
      });
    }

    function init() {
      var _options$keyboard = options.keyboard,
          keyboard = _options$keyboard === void 0 ? "global" : _options$keyboard;

      if (keyboard) {
        if (keyboard === "focused") {
          target = root;
          setAttribute(root, TAB_INDEX, 0);
        } else {
          target = window;
        }

        bind(target, "keydown", onKeydown);
      }
    }

    function destroy() {
      unbind(target, "keydown");

      if (isHTMLElement(target)) {
        removeAttribute(target, TAB_INDEX);
      }
    }

    function onKeydown(e) {
      var key = e.key;
      var normalizedKey = includes(IE_ARROW_KEYS, key) ? "Arrow" + key : key;

      if (normalizedKey === resolve("ArrowLeft")) {
        Splide2.go("<");
      } else if (normalizedKey === resolve("ArrowRight")) {
        Splide2.go(">");
      }
    }

    return {
      mount: mount,
      destroy: destroy
    };
  }

  var SRC_DATA_ATTRIBUTE = DATA_ATTRIBUTE + "-lazy";
  var SRCSET_DATA_ATTRIBUTE = SRC_DATA_ATTRIBUTE + "-srcset";
  var IMAGE_SELECTOR = "[" + SRC_DATA_ATTRIBUTE + "], [" + SRCSET_DATA_ATTRIBUTE + "]";

  function LazyLoad(Splide2, Components2, options) {
    var _EventInterface14 = EventInterface(Splide2),
        on = _EventInterface14.on,
        off = _EventInterface14.off,
        bind = _EventInterface14.bind,
        emit = _EventInterface14.emit;

    var isSequential = options.lazyLoad === "sequential";
    var images = [];
    var index = 0;

    function mount() {
      if (options.lazyLoad) {
        on([EVENT_MOUNTED, EVENT_REFRESH], function () {
          destroy();
          init();
        });

        if (!isSequential) {
          on([EVENT_MOUNTED, EVENT_REFRESH, EVENT_MOVED], observe);
        }
      }
    }

    function init() {
      Components2.Slides.forEach(function (_Slide) {
        queryAll(_Slide.slide, IMAGE_SELECTOR).forEach(function (_img) {
          var src = getAttribute(_img, SRC_DATA_ATTRIBUTE);
          var srcset = getAttribute(_img, SRCSET_DATA_ATTRIBUTE);

          if (src !== _img.src || srcset !== _img.srcset) {
            var _spinner = create("span", options.classes.spinner, _img.parentElement);

            setAttribute(_spinner, ROLE, "presentation");
            images.push({
              _img: _img,
              _Slide: _Slide,
              src: src,
              srcset: srcset,
              _spinner: _spinner
            });
            display(_img, "none");
          }
        });
      });

      if (isSequential) {
        loadNext();
      }
    }

    function destroy() {
      index = 0;
      images = [];
    }

    function observe() {
      images = images.filter(function (data) {
        if (data._Slide.isWithin(Splide2.index, options.perPage * ((options.preloadPages || 1) + 1))) {
          return load(data);
        }

        return true;
      });

      if (!images.length) {
        off(EVENT_MOVED);
      }
    }

    function load(data) {
      var _img = data._img;
      addClass(data._Slide.slide, CLASS_LOADING);
      bind(_img, "load error", function (e) {
        onLoad(data, e.type === "error");
      });
      ["src", "srcset"].forEach(function (name) {
        if (data[name]) {
          setAttribute(_img, name, data[name]);
          removeAttribute(_img, name === "src" ? SRC_DATA_ATTRIBUTE : SRCSET_DATA_ATTRIBUTE);
        }
      });
    }

    function onLoad(data, error) {
      var _Slide = data._Slide;
      removeClass(_Slide.slide, CLASS_LOADING);

      if (!error) {
        remove(data._spinner);
        display(data._img, "");
        emit(EVENT_LAZYLOAD_LOADED, data._img, _Slide);
        emit(EVENT_RESIZE);
      }

      if (isSequential) {
        loadNext();
      }
    }

    function loadNext() {
      if (index < images.length) {
        load(images[index++]);
      }
    }

    return {
      mount: mount,
      destroy: destroy
    };
  }

  function Pagination(Splide2, Components2, options) {
    var _EventInterface15 = EventInterface(Splide2),
        on = _EventInterface15.on,
        emit = _EventInterface15.emit,
        bind = _EventInterface15.bind,
        unbind = _EventInterface15.unbind;

    var Slides = Components2.Slides,
        Elements = Components2.Elements,
        Controller = Components2.Controller;
    var hasFocus = Controller.hasFocus,
        getIndex = Controller.getIndex;
    var items = [];
    var list;

    function mount() {
      init();
      on([EVENT_UPDATED, EVENT_REFRESH], init);
      on([EVENT_MOVE, EVENT_SCROLLED], update);
    }

    function init() {
      destroy();

      if (options.pagination && Slides.isEnough()) {
        createPagination();
        emit(EVENT_PAGINATION_MOUNTED, {
          list: list,
          items: items
        }, getAt(Splide2.index));
        update();
      }
    }

    function destroy() {
      if (list) {
        remove(list);
        items.forEach(function (item) {
          unbind(item.button, "click");
        });
        empty(items);
        list = null;
      }
    }

    function createPagination() {
      var length = Splide2.length;
      var classes = options.classes,
          i18n = options.i18n,
          perPage = options.perPage;
      var parent = options.pagination === "slider" && Elements.slider || Elements.root;
      var max = hasFocus() ? length : ceil(length / perPage);
      list = create("ul", classes.pagination, parent);

      for (var i = 0; i < max; i++) {
        var li = create("li", null, list);
        var button = create("button", {
          class: classes.page,
          type: "button"
        }, li);
        var controls = Slides.getIn(i).map(function (Slide) {
          return Slide.slide.id;
        });
        var text = !hasFocus() && perPage > 1 ? i18n.pageX : i18n.slideX;
        bind(button, "click", onClick.bind(null, i));
        setAttribute(button, ARIA_CONTROLS, controls.join(" "));
        setAttribute(button, ARIA_LABEL, format(text, i + 1));
        items.push({
          li: li,
          button: button,
          page: i
        });
      }
    }

    function onClick(page) {
      Controller.go(">" + page, true, function () {
        var Slide = Slides.getAt(Controller.toIndex(page));
        Slide && Slide.slide.focus();
      });
    }

    function getAt(index) {
      return items[Controller.toPage(index)];
    }

    function update() {
      var prev = getAt(getIndex(true));
      var curr = getAt(getIndex());

      if (prev) {
        removeClass(prev.button, CLASS_ACTIVE);
        removeAttribute(prev.button, ARIA_CURRENT);
      }

      if (curr) {
        addClass(curr.button, CLASS_ACTIVE);
        setAttribute(curr.button, ARIA_CURRENT, true);
      }

      emit(EVENT_PAGINATION_UPDATED, {
        list: list,
        items: items
      }, prev, curr);
    }

    return {
      items: items,
      mount: mount,
      destroy: destroy,
      getAt: getAt
    };
  }

  var TRIGGER_KEYS = [" ", "Enter", "Spacebar"];

  function Sync(Splide2, Components2, options) {
    var splides = Splide2.splides;
    var list = Components2.Elements.list;

    function mount() {
      if (options.isNavigation) {
        navigate();
      } else {
        sync();
      }
    }

    function destroy() {
      removeAttribute(list, ALL_ATTRIBUTES);
    }

    function sync() {
      var processed = [];
      splides.concat(Splide2).forEach(function (splide, index, instances) {
        EventInterface(splide).on(EVENT_MOVE, function (index2, prev, dest) {
          instances.forEach(function (instance) {
            if (instance !== splide && !includes(processed, splide)) {
              processed.push(instance);
              instance.go(instance.is(LOOP) ? dest : index2);
            }
          });
          empty(processed);
        });
      });
    }

    function navigate() {
      var _EventInterface16 = EventInterface(Splide2),
          on = _EventInterface16.on,
          emit = _EventInterface16.emit;

      on(EVENT_CLICK, onClick);
      on(EVENT_SLIDE_KEYDOWN, onKeydown);
      on([EVENT_MOUNTED, EVENT_UPDATED], update);
      setAttribute(list, ROLE, "menu");
      emit(EVENT_NAVIGATION_MOUNTED, Splide2.splides);
    }

    function update() {
      setAttribute(list, ARIA_ORIENTATION, options.direction !== TTB ? "horizontal" : null);
    }

    function onClick(Slide) {
      Splide2.go(Slide.index);
    }

    function onKeydown(Slide, e) {
      if (includes(TRIGGER_KEYS, e.key)) {
        onClick(Slide);
        prevent(e);
      }
    }

    return {
      mount: mount,
      destroy: destroy
    };
  }

  function Wheel(Splide2, Components2, options) {
    var _EventInterface17 = EventInterface(Splide2),
        bind = _EventInterface17.bind;

    function mount() {
      if (options.wheel) {
        bind(Components2.Elements.track, "wheel", onWheel, {
          passive: false,
          capture: true
        });
      }
    }

    function onWheel(e) {
      var deltaY = e.deltaY;

      if (deltaY) {
        Splide2.go(deltaY < 0 ? "<" : ">");
        prevent(e);
      }
    }

    return {
      mount: mount
    };
  }

  var ComponentConstructors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Options: Options,
    Direction: Direction,
    Elements: Elements,
    Slides: Slides,
    Layout: Layout,
    Clones: Clones,
    Move: Move,
    Controller: Controller,
    Arrows: Arrows,
    Autoplay: Autoplay,
    Cover: Cover,
    Scroll: Scroll,
    Drag: Drag,
    Keyboard: Keyboard,
    LazyLoad: LazyLoad,
    Pagination: Pagination,
    Sync: Sync,
    Wheel: Wheel
  });
  var I18N = {
    prev: "Previous slide",
    next: "Next slide",
    first: "Go to first slide",
    last: "Go to last slide",
    slideX: "Go to slide %s",
    pageX: "Go to page %s",
    play: "Start autoplay",
    pause: "Pause autoplay"
  };
  var DEFAULTS = {
    type: "slide",
    speed: 400,
    waitForTransition: true,
    perPage: 1,
    arrows: true,
    pagination: true,
    interval: 5e3,
    pauseOnHover: true,
    pauseOnFocus: true,
    resetProgress: true,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    drag: true,
    direction: "ltr",
    slideFocus: true,
    trimSpace: true,
    focusableNodes: "a, button, textarea, input, select, iframe",
    classes: CLASSES,
    i18n: I18N
  };

  function Fade(Splide2, Components2, options) {
    var _EventInterface18 = EventInterface(Splide2),
        on = _EventInterface18.on;

    function mount() {
      on([EVENT_MOUNTED, EVENT_REFRESH], function () {
        nextTick(function () {
          Components2.Slides.style("transition", "opacity " + options.speed + "ms " + options.easing);
        });
      });
    }

    function start(index, done) {
      var track = Components2.Elements.track;
      style(track, "height", unit(rect(track).height));
      nextTick(function () {
        done();
        style(track, "height", "");
      });
    }

    return {
      mount: mount,
      start: start,
      cancel: noop
    };
  }

  function Slide(Splide2, Components2, options) {
    var _EventInterface19 = EventInterface(Splide2),
        bind = _EventInterface19.bind;

    var Move = Components2.Move,
        Controller = Components2.Controller;
    var list = Components2.Elements.list;
    var endCallback;

    function mount() {
      bind(list, "transitionend", function (e) {
        if (e.target === list && endCallback) {
          cancel();
          endCallback();
        }
      });
    }

    function start(index, done) {
      var destination = Move.toPosition(index, true);
      var position = Move.getPosition();
      var speed = getSpeed(index);

      if (abs(destination - position) >= 1 && speed >= 1) {
        apply("transform " + speed + "ms " + options.easing);
        Move.translate(destination, true);
        endCallback = done;
      } else {
        Move.jump(index);
        done();
      }
    }

    function cancel() {
      apply("");
    }

    function getSpeed(index) {
      var rewindSpeed = options.rewindSpeed;

      if (Splide2.is(SLIDE) && rewindSpeed) {
        var prev = Controller.getIndex(true);
        var end = Controller.getEnd();

        if (prev === 0 && index >= end || prev >= end && index === 0) {
          return rewindSpeed;
        }
      }

      return options.speed;
    }

    function apply(transition) {
      style(list, "transition", transition);
    }

    return {
      mount: mount,
      start: start,
      cancel: cancel
    };
  }

  var _Splide = /*#__PURE__*/function () {
    function _Splide(target, options) {
      this.event = EventBus();
      this.Components = {};
      this.state = State(CREATED);
      this.splides = [];
      this._options = {};
      this._Extensions = {};
      var root = isString(target) ? query(document, target) : target;
      assert(root, root + " is invalid.");
      this.root = root;
      merge(DEFAULTS, _Splide.defaults);
      merge(merge(this._options, DEFAULTS), options || {});
    }

    var _proto = _Splide.prototype;

    _proto.mount = function mount(Extensions, Transition) {
      var _this3 = this;

      var state = this.state,
          Components2 = this.Components;
      assert(state.is([CREATED, DESTROYED]), "Already mounted!");
      state.set(CREATED);
      this._Components = Components2;
      this._Transition = Transition || this._Transition || (this.is(FADE) ? Fade : Slide);
      this._Extensions = Extensions || this._Extensions;
      var Constructors = assign({}, ComponentConstructors, this._Extensions, {
        Transition: this._Transition
      });
      forOwn(Constructors, function (Component, key) {
        var component = Component(_this3, Components2, _this3._options);
        Components2[key] = component;
        component.setup && component.setup();
      });
      forOwn(Components2, function (component) {
        component.mount && component.mount();
      });
      this.emit(EVENT_MOUNTED);
      addClass(this.root, CLASS_INITIALIZED);
      state.set(IDLE);
      this.emit(EVENT_READY);
      return this;
    };

    _proto.sync = function sync(splide) {
      this.splides.push(splide);
      splide.splides.push(this);
      return this;
    };

    _proto.go = function go(control) {
      this._Components.Controller.go(control);

      return this;
    };

    _proto.on = function on(events, callback) {
      this.event.on(events, callback, null, DEFAULT_USER_EVENT_PRIORITY);
      return this;
    };

    _proto.off = function off(events) {
      this.event.off(events);
      return this;
    };

    _proto.emit = function emit(event) {
      var _this$event;

      (_this$event = this.event).emit.apply(_this$event, [event].concat(slice(arguments, 1)));

      return this;
    };

    _proto.add = function add(slides, index) {
      this._Components.Slides.add(slides, index);

      return this;
    };

    _proto.remove = function remove(matcher) {
      this._Components.Slides.remove(matcher);

      return this;
    };

    _proto.is = function is(type) {
      return this._options.type === type;
    };

    _proto.refresh = function refresh() {
      this.emit(EVENT_REFRESH);
      return this;
    };

    _proto.destroy = function destroy(completely) {
      if (completely === void 0) {
        completely = true;
      }

      var event = this.event,
          state = this.state;

      if (state.is(CREATED)) {
        event.on(EVENT_READY, this.destroy.bind(this, completely), this);
      } else {
        forOwn(this._Components, function (component) {
          component.destroy && component.destroy(completely);
        });
        event.emit(EVENT_DESTROY);
        event.destroy();
        empty(this.splides);
        state.set(DESTROYED);
      }

      return this;
    };

    _createClass(_Splide, [{
      key: "options",
      get: function get() {
        return this._options;
      },
      set: function set(options) {
        var _options = this._options;
        merge(_options, options);

        if (!this.state.is(CREATED)) {
          this.emit(EVENT_UPDATED, _options);
        }
      }
    }, {
      key: "length",
      get: function get() {
        return this._Components.Slides.getLength(true);
      }
    }, {
      key: "index",
      get: function get() {
        return this._Components.Controller.getIndex();
      }
    }]);

    return _Splide;
  }();

  var Splide = _Splide;
  Splide.defaults = {};
  Splide.STATES = STATES;
  return Splide;
});
//# sourceMappingURL=splide.js.map
