import { updateDoc } from "@firebase/firestore";
import FullDateTime from "../reuseables/FullDateTime";
import RoundTo from "../reuseables/RoundTo";

const WinBuyTrade = (docRef, percentOfAmount, current_price, traderDoc, userRef, toAdd) => {
    
  updateDoc(docRef, {
    addition: percentOfAmount,
    settleTime: FullDateTime(),
    entryPrice: RoundTo(current_price, 2),
    outcome: "Win",
    status: "done",
    settlePrice: RoundTo((current_price + toAdd), 2),
  }).then(async () => {
    if (traderDoc.trader_balance === 0) {
      await updateDoc(userRef, {
        bonus: 5,
      }).then(async () => {
        await updateDoc(userRef, {
          balance: traderDoc.trader_balance + percentOfAmount,
        });
      });
    } else {
      await updateDoc(userRef, {
        balance: traderDoc.trader_balance + percentOfAmount,
      });
    }
  });
}

export default WinBuyTrade
