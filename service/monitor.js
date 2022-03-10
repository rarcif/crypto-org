const validatorServices = require('../service/ValidatorService');
const { collectData, populateConsensusNodeAddress } = require('../service/collectValidatorsData');
const { getSignaturesByLastHeight, persistSignatures } = require('../service/BlocksService');
const commissionAnalysis = require("./change_analysis");
const fs = require('fs');
const { notifyLowPerformanceValidator, notifyRecoveryValidator } = require('./alert-bot');
const axios = require('axios');
const COLLECT_INFORMATION_VALIDATORS_INTERVAL = 5;


setInterval(async () => {
    /*
    const data = fs.readFileSync('./collectedData/block_missed.json', 'utf8')
    let blocksMissedInfo = JSON.parse(data);
    */
    try {
        const api2 = axios.create({
            baseURL: `https://mainnet.crypto.org:1317/cosmos/slashing/v1beta1/signing_infos`
        })

        const response = await api2.get();
        console.log("Running blocks mised collect")
        response.data.info.map(async validator => {

            validatorServices.updateBlocksMissedByConsensusNodeAddress(validator.address, validator.missed_blocks_counter)
        })
    } catch (e) {
        console.log(e)
    }

}, 3 * 1000);

setInterval(async () => {
    const validators = await validatorServices.getLowPerformanceValidators();
    validators.map(validator => {
        const { moniker, missed_blocks, alert_status } = validator;
        const performance = 100 - ((missed_blocks * 100) / 5000)
        console.log(moniker, "Performance:", `${performance}%`, `${alert_status}`)

        if (`${alert_status}` !== '95' && performance <= 95.5 && performance >= 94.5) {
            notifyLowPerformanceValidator(moniker, performance, '95')
            validator.alert_status = '95'
            validator.save()
        }
        if (`${alert_status}` !== '85' && performance <= 85.5 && performance >= 84.5) {
            notifyLowPerformanceValidator(moniker, performance, '85')
            validator.alert_status = '85'
            validator.save()
        }
        if (`${alert_status}` !== '75' && performance <= 75.5 && performance >= 74.5) {
            notifyLowPerformanceValidator(moniker, performance, '75')
            validator.alert_status = '75'
            validator.save()
        }
        if (`${alert_status}` !== '65' && performance <= 65.5 && performance >= 64.5) {
            notifyLowPerformanceValidator(moniker, performance, '65')
            validator.alert_status = '65'

            validator.save()
        }
        if (`${alert_status}` !== '55' && performance <= 55.5 && performance >= 54.5) {
            notifyLowPerformanceValidator(moniker, performance, '55')
            validator.alert_status = '55'
            validator.save()
        }


    })
}, 60 * 1000)

setInterval(async () => {
    collectData().then(result => {
        console.log("Finish collect data!!!")
        console.log("Start populate consensusNodeAddress!!!");
        populateConsensusNodeAddress().then(console.log("Finish populate consensusNodeAddress!!!"))
    }).catch(err => {
        console.log(err.message)
    })
    //updateCheckpointInDatabase();
}, COLLECT_INFORMATION_VALIDATORS_INTERVAL * 1000);
