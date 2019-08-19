export const findElementParent = (element, selector) => {
  while (!element.matches(selector)) element = element.parentElement;
  return element;
};
