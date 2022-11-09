import { updateDoc } from "@firebase/firestore";
import FullDateTime from "../reuseables/FullDateTime";
import RoundTo from "../reuseables/RoundTo";

const LostBuyTrade = (docRef, addition, current_price, traderDoc, userRef, toAdd) => {
  // console.info(traderDoc, percentOfAmount);
    updateDoc(docRef, {
        settleTime: FullDateTime(),
        addition: addition,
        entryPrice: RoundTo(current_price, 2),
        outcome: "Lost",
        status: "done",
        settlePrice: RoundTo((current_price - toAdd), 2),
      }).then(async () => {
        if (traderDoc.trader_balance === 0) {
          await updateDoc(userRef, {
            bonus: traderDoc.trader_bonus - traderDoc.amount_traded,
          }).then(async () => {
            await updateDoc(userRef, {
              balance: 0,
            });
          });
        } else {
          if (
            traderDoc.trader_balance > traderDoc.trader_bonus
          ) {
            await updateDoc(userRef, {
              balance: traderDoc.trader_balance - traderDoc.amount_traded,
            });
          } else {
            await updateDoc(userRef, {
              bonus: traderDoc.trader_bonus - traderDoc.amount_traded,
            });
          }
        }
    });
}

export default LostBuyTrade
