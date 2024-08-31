const functions = {
    getMeals: {
        handler: 'src/functions/getMeals/index.handler',
        events: [
            {
                http: {
                    method: 'get',
                    path: 'meals',
                },
            },
        ],
    },
};
export default functions;
//# sourceMappingURL=functions.js.map