import Determinant from "./Determinant";
import HandleUnion from "./HandleUnion";

const AutomationHandler = async (expiredTrades) => {

    expiredTrades.forEach((doc) => {
        if(doc.union == true){
            HandleUnion(doc.unionID)
        }else{
            Determinant(doc.id, doc)
        }
    });
}

export default AutomationHandler
