export function extractQueryParams(query) {
    return query.split('&').reduce((queryParams, param) => {
        const [key, value] = param.split('=');
        queryParams[key] = value;
        return queryParams;
    }, {})
}