// Accounting for HTML's behaviour
const addHtmlEntities = (str: string) => {
    return String(str).replace(/&lt;/g, "<").replace(/&gt;/g, ">");
};

const stripHtmlEntities = (str: String) => {
    return String(str)
    .replace(/\n/g, "<br> <br>")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};
export { addHtmlEntities, stripHtmlEntities };