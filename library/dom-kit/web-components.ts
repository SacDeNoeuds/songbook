// import { isDeepEqual } from "../std/is-deep-equal";
// import { State } from "../std/reactivity";
// import { executeWithContext } from "./dom-kit";

// /**
//  * @param {TemplateStringsArray} css
//  * @returns {CSSStyleSheet}
//  */
// export const stylesheet = (css) => {
//   const stylesheet = new CSSStyleSheet();
//   stylesheet.replaceSync(css.join());
//   return stylesheet;
// };
// export { stylesheet as css };

// /**
//  * @template T
//  * @typedef {object} AttributeDescriptor
//  * @property {(host: Element, name: string) => T} get
//  * @property {(host: Element, name: string, value: T) => void} set
//  */

// export const attrs = {
//   /** @type {AttributeDescriptor<string>} */
//   string: {
//     get: (host, name) => host.getAttribute(name),
//     set: (host, name, value) => host.setAttribute(name, value),
//   },
//   /** @type {AttributeDescriptor<number>} */
//   number: {
//     get: (host, name) => Number(host.getAttribute(name)),
//     set: (host, name, value) => host.setAttribute(name, value.toString()),
//   },
//   /** @type {AttributeDescriptor<boolean>} */
//   boolean: {
//     get: (host, name) => host.hasAttribute(name),
//     set: (host, name, value) => host.toggleAttribute(name, value),
//   },
//   /**
//    * @template T
//    * @param {AttributeDescriptor<T>} desc
//    * @returns {AttributeDescriptor<T | undefined>}
//    */
//   optional: (desc) => ({
//     get: (host, name) =>
//       host.hasAttribute(name) ? desc.get(host, name) : undefined,
//     set: (host, name, value) =>
//       value === undefined
//         ? host.removeAttribute(name)
//         : desc.set(host, name, value),
//   }),
// };

// /**
//  * @template T
//  * @param {HTMLElement} element
//  * @param {string} name
//  * @param {AttributeDescriptor<T>} descriptor
//  */
// const registerAttribute = (element, name, descriptor) => {
//   const state = State(descriptor.get(element, name), { equals: isDeepEqual });
//   element[name] = state;
//   state.onChange((next) => {
//     descriptor.set(element, name, next);
//   });
// };

// /**
//  * @template T
//  * @typedef {import('./lib/std/reactivity').State<T>} State
//  */

// /**
//  * @template {typeof HTMLElement} T
//  * @template {Record<string, AttributeDescriptor<any>>} Attrs
//  * @param {object} params
//  * @param {T} [params.Base]
//  * @param {Attrs} [params.attributes]
//  * @param {CSSStyleSheet[]} [params.styles]
//  * @param {boolean} [params.shadowDom]
//  * @returns {{ prototype: InstanceType<T>, observedAttributes: string[], new (): (InstanceType<T> & { root: InstanceType<T> | ShadowRoot } & { [Key in keyof Attrs]: State<ReturnType<Attrs[Key]['get']>> }) }}
//  */
// export const WebComponent = (params) => {
//   const Base = params.Base ?? HTMLElement;
//   // @ts-ignore
//   const Class = class extends Base {
//     static get observedAttributes() {
//       return Object.keys(params.attributes ?? {});
//     }

//     constructor() {
//       super();
//       for (const [key, descriptor] of Object.entries(params.attributes ?? {})) {
//         registerAttribute(this, key, descriptor);
//       }
//       this.root = params.shadowDom ? this.attachShadow({ mode: "open" }) : this;
//       if (Base !== HTMLElement) this.attachInternals();

//       if (params.styles) {
//         const cssRoot = this.shadowRoot || document;
//         params.styles.forEach((sheet) => {
//           if (cssRoot.adoptedStyleSheets.includes(sheet)) return;
//           logger.info("add sheet", sheet.cssRules);
//           cssRoot.adoptedStyleSheets.push(sheet);
//         });
//       }
//     }

//     connectedCallback() {
//       const node = this.render();
//       if (!node) return this.mount();
//       executeWithContext({ root: this.root }, () => {
//         this.root.replaceChildren(node);
//       });
//       this.mount();
//     }

//     disconnectedCallback() {
//       this.destroy();
//     }

//     attributeChangedCallback(name) {
//       this[name]?.set(params.attributes[name].get(this, name));
//     }

//     mount() {}
//     destroy() {}

//     render() {}
//   };
//   return Class;
// };

// /**
//  * @param {`${string}-${string}`} name
//  * @param {HTMLElement} Class
//  */
// export const defineElement = (name, Class) => {
//   const Current = customElements.get(name);
//   if (!Current) customElements.define(name, Class);
//   else if (Current !== Class) throw new Error(`${name} is already defined`);
// };
