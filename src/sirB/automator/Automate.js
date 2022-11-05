import { limit, onSnapshot, orderBy, query, where } from '@firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import CollectionRef from '../reuseables/CollectionRef';
import CoinAPI from '../reuseables/CoinAPI';
import TimeDiffInSecs from '../reuseables/TimeDiffInSecs';
import AutomationHandler from './AutomationHandler';

const Automate = () => {
    const [activeTrades, setactiveTrades] = useState([]);

    const docEvent = useRef()
    const activeTradesChecker = useRef();

    useEffect(() => {

        clearInterval(activeTradesChecker.current)
        handleTradesChecker()
        return () => clearInterval(activeTradesChecker.current)
    }, [activeTrades])

    useEffect(() => {
        handleListener()

        return () => {
            const unsubscribe = docEvent.current
            if(unsubscribe && Object.prototype.toString.call(unsubscribe) == '[object Function]')
            unsubscribe()
        }
    }, [])

    const handleListener = () => {
        const colRef = CollectionRef("requests")
    
        const q = query( colRef, 
            // You cannot order your query by any field included in an equality (=) or in clause
            // orderBy might not work here
            where("outcome", "==", ""),
            limit(10)
        );
  
        docEvent.current = onSnapshot(q, (snapshot)=>{
            let collections = [];
            snapshot.docs.forEach((doc)=>{
                collections.push({id:doc.id, ...doc.data()})
            })
            handleDocAdded(collections)
        })
    }
    
    const handleDocAdded = (collections) =>{
        // handle latest user trades
        setactiveTrades(prev=> [...collections])
    }

    const handleTradesChecker = () =>{
        activeTradesChecker.current = setInterval(() => {
            const date = new Date();
            const expiredTrades = activeTrades.filter(t => {
                return TimeDiffInSecs(t.time, date) > t.secondsPicked
            })
            
            if(expiredTrades.length){
                clearInterval(activeTradesChecker.current)
                const tradeIds = expiredTrades.map(trade => trade.tradeNo)
                AutomationHandler(tradeIds)
            }
        }, 40000);
    }
}

export default Automate
