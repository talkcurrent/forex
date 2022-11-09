import { doc, getDocs, getFirestore, query, where } from "@firebase/firestore";
import CoinAPI from "../reuseables/CoinAPI";
import CollectionRef from "../reuseables/CollectionRef";
import { randNumWitRange } from "../reuseables/randNumWitRange";
import RoundTo from "../reuseables/RoundTo";
import LostBuyTrade from "./LostBuyTrade";
import LostSellTrade from "./LostSellTrade";
import WinBuyTrade from "./WinBuyTrade";
import WinSellTrade from "./WinSellTrade";

const HandleUnion = async (unionID) => {
    
    const coin = await CoinAPI()
    const { current_price } = coin.find(c => c.name == "Bitcoin" && c.id =="bitcoin");

    const percentage = (amount_traded, percentage) => (amount_traded / 100) * percentage;
    
    const decider = randNumWitRange(2)
    const db = getFirestore();
    const colRef = CollectionRef("requests")
    //expected result: 2 documents with buy and sell trade
    const q = query( colRef, 
            where("unionID", "==", unionID),
            where("outcome", "==", "")
        );
    
    const unions = await getDocs(q);
    if(unions.size){
        const toAdd = randNumWitRange(30)
        unions.forEach(union => {
            const {amount_traded, percent ,docID ,position } = union.data();
            
            const addition = parseFloat(amount_traded)
            const percentOfAmount = percentage(amount_traded, percent)
            const docRef = doc(db, "requests", union.id);
            const userRef = doc(db, "users", docID);
            
            if(decider == 0){
                if(position == "Buy"){
                    LostBuyTrade(docRef, addition, current_price, union.data(), userRef, toAdd)
                }else{
                    WinSellTrade(docRef, percentOfAmount, current_price, union.data(), userRef, toAdd)
                }
            }else{
                if(position == "Buy"){
                    WinBuyTrade(docRef, percentOfAmount, current_price, union.data(), userRef, toAdd)
                }else{
                    LostSellTrade(docRef, addition, current_price, union.data(), userRef, toAdd)
                }
            }
        });
    }
}

export default HandleUnion
