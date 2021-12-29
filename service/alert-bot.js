const axios = require('axios');
const discord = require('discord.js');

const DISCORD_URL_WEBHOOK = 'https://discord.com/api/webhooks/912717467296628807/udjtEukV62-IipwrzymkYovUGq6-pCuzAOCEej0EpdV706oHQKBlcq2xnl2PC8TVaOWo';
const NOTIFY_COLOR_MESSAGE = 2463;
const api = axios.create({
    baseURL: DISCORD_URL_WEBHOOK
})

async function notifyJailedValidator(validatorMoniker) {

    const json = JSON.stringify({

        "username": "Crypto Alert",
        "embeds": [
            {
                "title": "Validator Jailed!",
                "color": NOTIFY_COLOR_MESSAGE,
                "fields": [
                    {
                        "name": "Moniker",
                        "value": validatorMoniker
                    }
                ],
                "thumbnail": {
                    "url": "https://static8.depositphotos.com/1320097/900/v/600/depositphotos_9000472-stock-illustration-not-allowed-sign.jpg"
                }
            }
        ]
    })
    await api.post("", json, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

async function notifyNewValidator(validator) {
    console.log("Notify New validator in Discord Bot:", validator.moniker)
    const { moniker, max_rate, rate, max_change_rate, operator_address, website, identity, security_contact, details } = validator;
    const fields = [];

    if (typeof moniker !== 'undefined') {
        fields.push({
            "name": "Moniker",
            "value": `${moniker}`
        })
    }
    if (typeof rate !== 'undefined') {
        fields.push({
            "name": "Rate",
            "value": `${rate}`
        })
    }
    if (typeof max_rate !== 'undefined') {
        fields.push({
            "name": "Max Rate",
            "value": `${max_rate}`
        })
    }
    if (typeof max_change_rate !== 'undefined') {
        fields.push({
            "name": "Max Rate Change",
            "value": `${rate}`
        })
    }

    if (typeof operator_address !== 'undefined') {
        fields.push({
            "name": "Operator Address",
            "value": `${operator_address}`
        })
    }
    if (typeof website !== 'undefined') {
        fields.push({
            "name": "Website",
            "value": `${website}`
        })
    }
    if (typeof security_contact !== 'undefined') {
        fields.push({
            "name": "Security Contact",
            "value": `${security_contact}`
        })
    }
    if (typeof details !== 'undefined') {
        fields.push({
            "name": "Details",
            "value": `${details}`
        })
    }

    const json = JSON.stringify({
        "username": "Crypto Alert",
        "embeds": [
            {
                "title": "New Validator!",
                "description": "New validator was identified in Crypto Network",
                "color": NOTIFY_COLOR_MESSAGE,
                "fields": fields,
                "thumbnail": {
                    "url": "https://t3.ftcdn.net/jpg/00/90/20/08/240_F_90200846_rAoY6CMRSJ7X8gFJyzyXKYtvxQqK28Lk.jpg"
                }
            }
        ]
    })
    console.log("Send notify change Info to Discord:", json)
    await api.post("", json, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

async function notifyLowPerformanceValidator(moniker, performance, alert_status) {
    let fields = [];
    let ICON=`🔴`;
    if (alert_status ==='95' || alert_status ==='90' || alert_status ==='85'){
        ICON = `🟡`
    }
    if(alert_status ==='80' || alert_status ==='75' || alert_status ==='70'){
        ICON=`🟠`
    }
    try {
        if (typeof moniker !== 'undefined') {
            fields.push({
                "name": "Moniker",
                "value": `${moniker}`
            })
        }
        if (typeof alert_status !== 'undefined') {
            fields.push({
                "name": "Performance",
                "value": `< ${alert_status} %`
            })
        }

        const json = JSON.stringify({
            "username": "Crypto Alert",
            "embeds": [
                {
                    "title": `${ICON} Validator performance is low.\nToo many blocks were lost!`,
                    "color": NOTIFY_COLOR_MESSAGE,
                    "fields": fields
                }
            ]
        });

        await api.post("", json, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch {

    }
}

async function notifyRecoveryValidator(validator) {

    try {
        console.log("Notify change validator in Discord Bot:", validator)
        const { status, missed_blocks, moniker, changesCount, max_rate, rate, max_change_rate, operator_address, website, identity, security_contact, details } = validator;
        let fields = [];
        if (typeof moniker !== 'undefined') {
            fields.push({
                "name": "Moniker",
                "value": `${moniker}`
            })
        }
        const json = JSON.stringify({
            "username": "Crypto Alert",
            "embeds": [
                {
                    "title": "✅ Validator was recovered!",
                    "color": NOTIFY_COLOR_MESSAGE,
                    "fields": fields
                }
            ]
        })
        console.log(json)
        await api.post("", json, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (err) {
        console.log("Error in notifyRecoveryValidator:", err.message)
    }

}

async function notifyChangeValidator(validator, oldMoniker, changesCount) {

    try {
        console.log("Notify change validator in Discord Bot:", validator)
        const { status, moniker, max_rate, rate, max_change_rate, operator_address, website, identity, security_contact, details } = validator;
        let fields = [];
        if (typeof moniker !== 'undefined') {
            if (oldMoniker !== moniker) {
                fields.push({
                    "name": "Moniker",
                    "value": `Old: ${oldMoniker}\nNew: ${moniker}`
                })
            } else {
                fields.push({
                    "name": "Moniker",
                    "value": `${oldMoniker}`
                })
            }

        }
        if (typeof status !== 'undefined') {
            fields.push({
                "name": "Status",
                "value": `${status}`
            })
        }
        if (typeof rate !== 'undefined') {
            fields.push({
                "name": "Rate",
                "value": `${rate}`
            })
        }/*
        if (typeof changesCount !== 'undefined') {
            fields.push({
                "name": "WARNNING Changes Count!",
                "value": `${changesCount}`
            })
        }*/
        if (typeof operator_address !== 'undefined') {
            fields.push({
                "name": "Operator Address",
                "value": `${operator_address}`
            })
        }
        if (typeof website !== 'undefined') {
            fields.push({
                "name": "Website",
                "value": `${website}`
            })
        }
        if (typeof identity !== 'undefined') {
            fields.push({
                "name": "Identity",
                "value": `${identity}`
            })
        }
        if (typeof security_contact !== 'undefined') {
            fields.push({
                "name": "Security Contact",
                "value": `${security_contact}`
            })
        }
        if (typeof details !== 'undefined') {
            fields.push({
                "name": "Details",
                "value": `${details}`
            })
        }
        /*
        fields.push({
            "name": `Changes`,
            "value": `${changesCount}`
        })
        */
        let arrayBody = [];
        let stringPropertiesChanged="";
        
        let stringMoniker = "Modification Alert: "+moniker+"\n\nProperties that changed in the validator.";
        stringPropertiesChanged = stringPropertiesChanged+ fields[0].name;
        for(let i = 1; i< fields.length ; i++){
            stringPropertiesChanged=stringPropertiesChanged+", "+fields[i].name
        }/*
        arrayBody.push({
            "name":"Properties that changed in the validator.",
            "value": stringPropertiesChanged
        });
        */
        fields.map(field=>{
            arrayBody.push({
                "name": field.name,
                "value": field.value
            })
        });
        const json = JSON.stringify({
            "username": "Crypto Alert",
            "embeds": [
                {
                    "title": stringMoniker,
                    "color": NOTIFY_COLOR_MESSAGE,
                    "fields": arrayBody
                }
            ]
        })
        console.log(json)
        await api.post("", json, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (err) {
        console.log("Error in notifyChangeValidator:", err.message)
    }

}

module.exports = {
    notifyJailedValidator,
    notifyNewValidator,
    notifyChangeValidator,
    notifyLowPerformanceValidator,
    notifyRecoveryValidator
}
