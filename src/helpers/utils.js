

export const randomId = () => {
    return '_' + Math.random().toString(36).substring(2, 11);
};
  

export const UtilsHelper = {
    focusCursorToEnd: (ref) => {
      const element = ref.current;
      if (element) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.setStart(element, element.childNodes.length);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        element.focus();
      }
    },
  };
  
  export default UtilsHelper;
  
  const focusCursorToEnd = (ref) => {
    const element = ref.current;
    const range = document.createRange();
    const selection = window.getSelection();
    range.setStart(element.childNodes[0], element.innerText.length);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    element.focus();
  };
  
  export { focusCursorToEnd };


  //UtilsCOnnect 
  