import { doc, getDocs, getFirestore, limit, orderBy, query, where } from "@firebase/firestore";
import CoinAPI from "../reuseables/CoinAPI";
import CollectionRef from "../reuseables/CollectionRef";
import getPercentage from "../reuseables/getPercentage";
import LostBuyTrade from "./LostBuyTrade";
import LostSellTrade from "./LostSellTrade";
import WinBuyTrade from "./WinBuyTrade";
import WinSellTrade from "./WinSellTrade";
import { randNumWitRange } from "../reuseables/randNumWitRange";

/**
 * Handles each trade outcome
 * @param {string} docId - Document ID to handle
 * @param {number} doc - Amount used to trade
 * 
 */
const Determinant = async (docId, traderDoc) => {
  const db = getFirestore();
  const colRef = CollectionRef("requests")

  
  //get the last 50 trade
  const q = query( 
    colRef, 
    where("outcome", "!=", ""),
    orderBy("outcome"),
    orderBy("createdAt", "desc"),
    limit(5)
  );
  //tradeAmnt to assume a win for this trader at first
  let totalWinCost = Number(traderDoc.amount_traded);
  let totalLostCost = 0;

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
      if(doc.data().outcome == "Win"){
        totalWinCost += Number(doc.data().amount_traded)
      }else{
        totalLostCost += Number(doc.data().amount_traded)
      }
  });
  const [winPercentage, lostPercentage] = getPercentage([totalWinCost, totalLostCost]);
  
  const percentage = (amount_traded, percentage) => (amount_traded / 100) * percentage;

  const coin = await CoinAPI()
  const { current_price } = coin.find(c => c.name == "Bitcoin" && c.id =="bitcoin");
  
  const addition = parseFloat(traderDoc.amount_traded)
  const percentOfAmount = percentage(traderDoc.amount_traded, traderDoc.percent)
  const docRef = doc(db, "requests", docId);
  const userRef = doc(db, "users", traderDoc.docID);

  const toAdd = randNumWitRange(30)

  if (winPercentage >= 20) {
    // Update loss here
    if(traderDoc.position == "Buy"){
      LostBuyTrade(docRef, addition, current_price, traderDoc, userRef, toAdd)
    }else{
      LostSellTrade(docRef, addition, current_price, traderDoc, userRef, toAdd)
    }
  }else{
    // Update win here
    if(traderDoc.position == "Buy"){
      WinBuyTrade(docRef, percentOfAmount, current_price, traderDoc, userRef, toAdd)
    }else{
      WinSellTrade(docRef, percentOfAmount, current_price, traderDoc, userRef, toAdd)
    }
  }

}

export default Determinant
