import{toast}from"react-toastify";export const validateFormData=(t,o,e="light")=>{let a=!1;for(const r of o)if(!t[r.field]){toast.warn(r.message,{position:"top-center",theme:e}),a=!0;break}return a};
