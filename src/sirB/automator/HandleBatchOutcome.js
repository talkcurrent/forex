import { doc, getDocs, getFirestore, getDoc, limitToLast, orderBy, query, updateDoc, where } from '@firebase/firestore';
import CoinAPI from '../reuseables/CoinAPI';
import CollectionRef from '../reuseables/CollectionRef';
import getPercentage from '../reuseables/getPercentage';
import { randNumWitRange } from '../reuseables/randNumWitRange';
import RoundTo from '../reuseables/RoundTo';

const HandleBatchOutcome = async(path, batch) => {
    const db = getFirestore();
    const docRef = doc(db, path, batch.id);
    const batchNow = await getDoc(docRef);
    
    if(batchNow.data().entryPrice == ""){

        const coin = await CoinAPI()
        const { current_price } = coin.find(c => c.name == "Bitcoin" && c.id == "bitcoin");
        
        const toAdd = randNumWitRange(30, "float")
        //condition to determine settled price
        const colRef = CollectionRef("requests")


        //get the last 5 SETTLED trade
        const q = query( 
            CollectionRef("requests"), 
            where("outcome", "in", ['Win', 'Lost']),
            orderBy("createdAt"),
            limitToLast(5)
        );
        // unsettled trades
        const qUnsettled = query( 
            CollectionRef("requests"), 
            where("outcome", "==", ""),
            orderBy("createdAt"),
        );

        // unsettled buy trades
        const qUnsettledBuy = query( 
            CollectionRef("requests"), 
            where("outcome", "==", ""),
            where("position", "==", "Buy"),
            orderBy("createdAt"),
        );
        // unsettled sell trades
        const qUnsettledSell = query( 
            CollectionRef("requests"), 
            where("outcome", "==", ""),
            where("position", "==", "Sell"),
            orderBy("createdAt"),
        );
        // get trades position more costly
        let pendingBuyCost = 0;
        let pendingSellCost = 0;

        const buyDocs = await getDocs(qUnsettledBuy);
        buyDocs.forEach((doc) => {
            pendingBuyCost += Number(doc.data().amount_traded)
        });

        const sellDocs = await getDocs(qUnsettledSell);
        sellDocs.forEach((doc) => {
            pendingSellCost += Number(doc.data().amount_traded)
        });
        //
        let totalWinCost = 0;
        let totalLostCost = 0;

        const querySnapshotUnsettled = await getDocs(qUnsettled);
        querySnapshotUnsettled.forEach((doc) => {
            //assuming all pending trade would be won
            totalWinCost += Number(doc.data().amount_traded)
        });

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            if(doc.data().outcome == "Win"){
            totalWinCost += Number(doc.data().amount_traded)
            }else{
            totalLostCost += Number(doc.data().amount_traded)
            }
        });
        //percentage of last settled trades 
        const [winPercentage, lostPercentage] = getPercentage([
            totalWinCost + (pendingBuyCost > pendingSellCost? pendingBuyCost: pendingSellCost), 
            totalLostCost
        ]);
                
        if (winPercentage >= 20) {
            // position with most trades will lose
            if(pendingBuyCost > pendingSellCost){
                //all buy trades would be lost
                updateDoc(docRef, {
                    entryPrice: current_price,
                    settlePrice: RoundTo((current_price - toAdd), 2),
                })
            }else{
                //all sell trades would be lost
                updateDoc(docRef, {
                    entryPrice: current_price,
                    settlePrice: RoundTo((current_price + toAdd), 2),
                })
            }
        }else{
            // position with most trades will win
            if(pendingBuyCost > pendingSellCost){
                //all buy trades would be won
                updateDoc(docRef, {
                entryPrice: current_price,
                settlePrice: RoundTo((current_price + toAdd), 2),
                })
            }else{
                //all sell trades would be won
                updateDoc(docRef, {
                    entryPrice: current_price,
                    settlePrice: RoundTo((current_price - toAdd), 2),
                })
            }
        }
    }
}

export default HandleBatchOutcome
