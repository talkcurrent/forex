import { updateDoc } from "@firebase/firestore";
import FullDateTime from "../reuseables/FullDateTime";
import RoundTo from "../reuseables/RoundTo";

const WinBuyTrade = (docRef, percentOfAmount, entryPrice, settlePrice, traderDoc, userRef) => {
    
  updateDoc(docRef, {
    addition: percentOfAmount,
    settleTime: FullDateTime(),
    entryPrice: entryPrice,
    outcome: "Win",
    status: "done",
    settlePrice: settlePrice,
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
