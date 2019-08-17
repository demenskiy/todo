export const findParent = (el, selector) => {
  while (!el.matches(selector)) el = el.parentElement;
  return el;
};
