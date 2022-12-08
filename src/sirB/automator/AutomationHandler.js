import Determinant from "./Determinant";

const AutomationHandler = async (expiredTrades) => {

    expiredTrades.forEach((doc) => {
        Determinant(doc.id, doc)
    });
}

export default AutomationHandler
