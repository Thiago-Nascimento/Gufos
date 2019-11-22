export const usuarioAutenticado = () => localStorage.getItem("usuario-gufos") !== null

export const parseJwt = () => {
    var base64 = localStorage.getItem("usuario-gufos").split('.')[1]
    return JSON.parse(window.atob(base64))  // atob() decode encoded string to decoded
}