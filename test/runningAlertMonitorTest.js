
const validatorServices = require('../service/ValidatorService');
const { notifyLowPerformanceValidator, notifyRecoveryValidator } = require('../service/alert-bot')

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