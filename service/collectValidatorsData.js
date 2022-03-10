const { getValidatorSignerKey } = require("../until");
const validatorService = require('../service/ValidatorService');
const fs = require('fs');
const path = require('path');
const axios = require('axios')
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

async function populateConsensusNodeAddress() {
    try {
        let validatorsConsensusNodeaddres = new Map();

        const api3 = axios.create({
            baseURL: `https://mainnet.crypto.org:1317/validatorsets/latest`
        })
        const dataset = await api3.get();

        dataset.data.result.validators.map(validator => {
            validatorsConsensusNodeaddres.set(validator.pub_key.value, validator.address)
        })

        const api = axios.create({
            baseURL: `https://mainnet.crypto.org:1317/cosmos/staking/v1beta1/validators?pagination.limit=1000`
        })
        const { data } = await api.get()

        data.validators.map(validator => {
            const consensus_node_address = validatorsConsensusNodeaddres.get(validator.consensus_pubkey.key)
            if (typeof consensus_node_address !== 'undefined') {
                //validatorsPubKey.set(validator.operator_address,consensus_node_address)
                ///logic to persists consensus node address in validator
                validatorService.updateConsensusNodeAddressByOperatorAddress(validator.operator_address, consensus_node_address)
            }
        })
    } catch (e) {
        console.log(e)
    }

}

async function collectData() {

    try {


        /*
        const data = fs.readFileSync('./collectedData/valida.json', 'utf8')
        validatorsData = JSON.parse(data);
        */
        const api = axios.create({
            baseURL: `https://mainnet.crypto.org:1317/cosmos/staking/v1beta1/validators?pagination.limit=1000&status=BOND_STATUS_BONDED`
        })
        const { data } = await api.get()
        console.log("Collect Data is running...")
        await data.validators.map(validator => {

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
    } catch (err) {
        console.error(err)
    }

}

module.exports = {
    collectData,
    populateConsensusNodeAddress
}