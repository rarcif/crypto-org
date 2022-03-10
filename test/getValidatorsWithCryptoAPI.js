const axios = require('axios');

const api = axios.create({
    baseURL: `https://mainnet.crypto.org:1317/cosmos/staking/v1beta1/validators?pagination.limit=1000&status=BOND_STATUS_BONDED`
})

let validatorsPubKey = new Map();
let validatorsConsensusNodeaddres = new Map();

const api2 = axios.create({
    baseURL: `https://mainnet.crypto.org:1317/cosmos/slashing/v1beta1/signing_infos`
})


const api3 = axios.create({
    baseURL: `https://mainnet.crypto.org:1317/validatorsets/latest`
})

async function run() {
    try {

        const dataset = await api3.get();

        dataset.data.result.validators.map(validator=>{
            validatorsConsensusNodeaddres.set(validator.pub_key.value,validator.address)
        })

        const { data } = await api.get()
        data.validators.map(validator=>{
            const consensus_node_address = validatorsConsensusNodeaddres.get(validator.consensus_pubkey.key)
            if(typeof consensus_node_address !== 'undefined'){
                validatorsPubKey.set(validator.operator_address,consensus_node_address)
            }            
        })
        console.log(validatorsPubKey)


        
        const info = await api2.get();
        info.data.info.map(validator=>{
            //console.log(validator);
        })
    } catch (e) {
        console.log(e)
    }
}

run()


