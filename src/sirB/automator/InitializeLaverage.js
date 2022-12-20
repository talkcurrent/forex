import { doc, getDoc, getFirestore, setDoc } from '@firebase/firestore';

const InitializeLaverage = async (uid) => {
    const db = getFirestore();
    const today = (new Date()).toDateString();

    const q = doc(db, "laverages", uid);
    const laverage = await getDoc(q);

    if(!laverage.exists()){
        // create laverage document for this user
        const docData = {
            x1: {amount: 0, completed: false},
            x2: {amount: 0, completed: false},
            x3: {amount: 0, completed: false},
            x4: {amount: 0, completed: false},
            x5: {amount: 0, completed: false},
            x6: {amount: 0, completed: false},
            x7: {amount: 0, completed: false},
            x8: {amount: 0, completed: false},
            updatedAt: today
        };
    
        await setDoc(doc(db, "laverages", uid), docData);
    }


}

export default InitializeLaverage
