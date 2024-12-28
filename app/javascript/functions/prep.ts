// Accounting for HTML's behaviour
const addHtmlEntities = (str: string) => {
    return String(str).replace(/&lt;/g, "<").replace(/&gt;/g, ">");
};

export { addHtmlEntities }