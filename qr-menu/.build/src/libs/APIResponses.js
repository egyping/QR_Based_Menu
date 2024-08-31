export const formatJSONResponse = ({ body, statusCode = 200, headers, }) => ({
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*',
        ...headers,
    },
    statusCode,
    body: JSON.stringify(body),
});
//# sourceMappingURL=APIResponses.js.map