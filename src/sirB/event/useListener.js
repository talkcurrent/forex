import { onSnapshot, query, where } from "@firebase/firestore";
import { useRef } from "react";
import CollectionRef from "../reuseables/CollectionRef";

const useListener = () => {

    const docEvent = useRef();

    const handleListener = () => {
        const colRef = CollectionRef("requests")
    
        const q = query( colRef, where("outcome", "==", ""));
    
        docEvent.current = onSnapshot(q, (snapshot)=>{
            
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    handleDocAdded(change.doc.data())
                }
            });
        })
    }

    const handleDocAdded = (data) =>{
        return data;
    }

    return {handleListener}
}

export default useListener
