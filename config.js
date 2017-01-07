module.exports = {

    port: process.env.PORT || 5000,

    activeAI: "apiai",

    ai: {
        apiai: {
            version: "20170105",
            language: "en",
            clientToken: process.env.AI_TOKEN || '',
            devToken: process.env.AI_DEVTOKEN || ''
        },
        witai: {
            version: "20170105",
            language: "en",
            clientToken: process.env.AI_TOKEN || '',
            devToken: process.env.AI_DEVTOKEN || ''
        }
    }

}