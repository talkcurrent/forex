import { collection, getFirestore } from '@firebase/firestore';

/**
 * Return collection reference.
 * @param {string} collection_ - A string value: collection (table name)
 * 
 */

const CollectionRef = (collection_) => {
    // get firestore
    const db = getFirestore();
    // collection reference
    const colRef = collection(db, collection_);
    
    return colRef
}

export default CollectionRef
