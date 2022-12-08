import { updateDoc } from "@firebase/firestore";
import FullDateTime from "../reuseables/FullDateTime";
import RoundTo from "../reuseables/RoundTo";

const LostSellTrade = (docRef, addition, entryPrice, settlePrice, traderDoc, userRef) => {

    updateDoc(docRef, {
        settleTime: FullDateTime(),
        addition: addition,
        entryPrice: entryPrice,
        outcome: "Lost",
        status: "done",
        settlePrice: settlePrice,
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

export default LostSellTrade
