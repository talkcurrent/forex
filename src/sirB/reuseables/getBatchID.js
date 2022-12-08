import { addDoc, getCountFromServer, getDocs, limitToLast, orderBy, query, where } from "@firebase/firestore";
import CollectionRef from "./CollectionRef";
import FullDateTime from "./FullDateTime";

/**
 * Return an ID of document
 * @param {string} path - path to document
 * 
 */
const getBatchID = async (path, timeLeft) => {
    const colRef = CollectionRef(path)

    const q = query(colRef, 
      where("settlePrice", "==", ""), 
      // orderBy("settlePrice"),
      orderBy("createdAt"), 
      limitToLast(1)
    );

    const snapshot = await getCountFromServer(q);
    const { count } = snapshot.data();
    let batchID;

    if(count){
      const batches = await getDocs(q);
      batches.forEach((batch) => {
        batchID = batch.id;
      });
    }else{
      const batch = await addDoc(colRef, {
        batchAt: FullDateTime(),
        createdAt: new Date(),
        entryPrice: "",
        settlePrice: "",
        timeLeft: timeLeft,
      });
      batchID = batch.id;
    }

    return { batchID }
}

export default getBatchID
