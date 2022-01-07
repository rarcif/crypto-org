
const notify = require("../service/alert-bot");
const CommissionChangeRepository = require('../repository/commissionChangeRepository');
const Rawquery = require('../service/RawQuerys');
async function run(validatorInfo, validatorInDB) {
    //console.log("Collected validator Info:",validatorInfo.moniker);
    //console.log("Database validator Info Info:",JSON.parse(JSON.stringify(validatorInDB)).moniker );
    const oldMoniker = validatorInDB.moniker;
    let changesCount = 0;
    try {
        let alert = {
            status: false,
            moniker: false,
            website: false,
            identity: false,
            security_contact: false,
            details: false,
            rate: false
        };
        let notifyMessage = {}
        const { status, address_key, moniker, website, identity, security_contact, details, rate } = validatorInfo;
        
        if (status !== validatorInDB.status) {
            console.log("Change Status detected!", status, validatorInDB.status)
            alert.moniker = true;
            console.log(alert.status)
            notifyMessage = {
                ...notifyMessage,
                status
            }
            console.log(notifyMessage)
            changesCount+=1;
            validatorInDB.status = status;
        }
        if (moniker !== validatorInDB.moniker) {
            console.log("Change Moniker detected!", moniker, validatorInDB.moniker)
            alert.moniker = true;
            console.log(alert.moniker)
            notifyMessage = {
                ...notifyMessage,
                moniker
            }
            console.log(notifyMessage)
            changesCount+=1;
            validatorInDB.moniker = moniker;
        }else{
            notifyMessage = {
                ...notifyMessage,
                moniker: validatorInDB.moniker
            }
        }
        if (website !== validatorInDB.website) {
            alert.website = true;
            console.log("Change website detected!", website, validatorInDB.website)
            notifyMessage = {
                ...notifyMessage,
                website
            }
            validatorInDB.website = website;
            changesCount+=1;
        }
        if (identity !== validatorInDB.identity) {
            alert.identity = true;
            console.log("Change identity detected!", identity, validatorInDB.identity)
            console.log(alert)
            notifyMessage = {
                ...notifyMessage,
                identity
            }
            validatorInDB.identity = identity;
            changesCount+=1;
        }
        if (security_contact !== validatorInDB.security_contact) {
            alert.security_contact = true;
            console.log("Change security_contact detected!", security_contact, validatorInDB.security_contact)
            
            console.log(alert)
            notifyMessage = {
                ...notifyMessage,
                security_contact
            }
            validatorInDB.security_contact = security_contact;
            changesCount+=1;
        }
        if (details !== validatorInDB.details) {
            alert.details = true;

            console.log(alert)
            console.log("Change details detected!", details, validatorInDB.details)

            notifyMessage = {
                ...notifyMessage,
                details
            }
            validatorInDB.details = details;
            changesCount+=1;
        }
        if (+rate !== validatorInDB.rate) {
            alert.rate = true;
            await CommissionChangeRepository.createCommissionChange({
                address_key,
                old_value: validatorInDB.rate,
                new_value: rate,
            })/*
            const changesCount = await Rawquery.getCountLast30DaysChangeCommissionByValidatorAddressKey(address_key)
            console.log(alert)
            console.log(changesCount)*/
            console.log("Change rate detected!", details, validatorInDB.rate)
            notifyMessage = {
                ...notifyMessage,
                rate
            }
            validatorInDB.rate = rate;
            changesCount+=1;
        }
        
        if ( alert.status || alert.moniker || alert.rate || alert.identity || alert.security_contact || alert.website | alert.details) {
            console.log("Notify Message:", notifyMessage)
            if(validatorInDB.status==='BOND_STATUS_BONDED'){
                notify.notifyChangeValidator(notifyMessage,oldMoniker,changesCount);
            } 
            if(status==='BOND_STATUS_UNSPECIFIED'){
                notify.notifyChangeValidator(notifyMessage,oldMoniker,changesCount);
            }
            if(status==='BOND_STATUS_UNBONDING'){
                notify.notifyChangeValidator(notifyMessage,oldMoniker,changesCount);
            }
            if(status==='BOND_STATUS_UNBONDED'){
                notify.notifyChangeValidator(notifyMessage,oldMoniker,changesCount);
            }              
            console.log("Identified change in validator!");
            console.log(alert)
            validatorInDB.save();
        }


    } catch (err) {
        console.log("Error", err.message)
    }
    return false;

}

module.exports = {
    run
}