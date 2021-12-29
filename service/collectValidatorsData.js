const { getValidatorSignerKey } = require("../until");
const validatorService = require('../service/ValidatorService');
const fs = require('fs');
const path = require('path')
let validatorsData;
async function updateValidatorsAddressKey() {
    console.log("Update Signer key is running...")
    await getValidatorSignerKey().then(response => {

        let validatorsData = response.data.result.validators;
        validatorsData.map(async validator => {

            const key = validator.pub_key.value;
            let vali = await validatorService.getValidatorByAddressKey(key)
            if (vali) {
                validatorService.updateValidatorSigner(key, validator.address)
                const teste = await validatorService.getValidatorByAddressKey(key)
            }
        })
    }).catch(err => {
        console.log(err)
    })

}

async function collectData() {

    try {
        const data = fs.readFileSync('./collectedData/valida.json', 'utf8')
        validatorsData = JSON.parse(data);
      } catch (err) {
        console.error(err)
      }
    console.log("Collect Data is running...")
    await validatorsData.validators.map(validator => {

        const key = validator.consensus_pubkey.key;
        const moniker = validator.description.moniker;
        const status = validator.status;
        const email = validator.description.security_contact;
        const rate = validator.commission.commission_rates.rate;
        const max_rate = validator.commission.commission_rates.max_rate;
        const max_change_rate = validator.commission.commission_rates.max_change_rate;
        const jailed = validator.jailed;
        const website = validator.description.website;
        const details = validator.description.details;
        const security_contact = validator.description.security_contact;
        const identity = validator.description.identity;
        const operator_address = validator.operator_address;

        validatorService.createValidator(moniker, key, email, status, rate, max_rate, max_change_rate, jailed, operator_address, website, details, security_contact, identity)
    })

    await updateValidatorsAddressKey().then(() => {
        console.log("Update Signer key is finished")
    }).catch(err => {
        console.log(err.message)
    })
}

module.exports = {
    collectData
}