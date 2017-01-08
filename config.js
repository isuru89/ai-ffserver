module.exports = {

    port: process.env.PORT || 5000,

    activeAI: "apiai",

    ai: {
        apiai: {
            version: "20170105",
            language: "en",
            clientToken: process.env.AI_TOKEN || 'abcdef',
            devToken: process.env.AI_DEVTOKEN || 'abcdef'
        },
        witai: {
            version: "20170105",
            language: "en",
            clientToken: process.env.AI_TOKEN || 'abcdef',
            devToken: process.env.AI_DEVTOKEN || 'abcdef'
        }
    }

}