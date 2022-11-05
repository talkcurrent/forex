import { doc, getDoc, updateDoc } from "@firebase/firestore";
import db from "../store/server.config";

const awardReferrer = async (depositedAmount, referrerId) => {
  let firstReferrer = referrerId;
  let secondReferrer = "";
  let thirdReferrer = "";

  if (!referrerId) {
    return;
  }

  const firstReferrerDocRef = doc(db, "users", firstReferrer);
  const firstReferrerDoc = await getDoc(firstReferrerDocRef);
  if (firstReferrerDoc.exists()) {
    secondReferrer = firstReferrerDoc.data().referrerId;
  }

  let secondReferrerDocRef, secondReferrerDoc;
  if (secondReferrer) {
    secondReferrerDocRef = doc(db, "users", secondReferrer);
    secondReferrerDoc = await getDoc(secondReferrerDocRef);
    if (secondReferrerDoc.exists()) {
      thirdReferrer = secondReferrerDoc.data().referrerId;
    }
  }

  let thirdReferrerDocRef, thirdReferrerDoc;
  if (thirdReferrer) {
    thirdReferrerDocRef = doc(db, "users", thirdReferrer);
    thirdReferrerDoc = await getDoc(thirdReferrerDocRef);
  }

  console.debug(
    firstReferrerDoc.data(),
    secondReferrerDoc?.data(),
    thirdReferrerDoc?.data()
  );

  if (firstReferrer) {
    await updateDoc(firstReferrerDocRef, {
      bonus: (firstReferrerDoc.data().bonus || 0) + (depositedAmount * 5) / 100,
      classOneBonus:
        (firstReferrerDoc.data().classOneBonus || 0) +
        (depositedAmount * 5) / 100,
    });
  }

  if (secondReferrer) {
    await updateDoc(secondReferrerDocRef, {
      bonus:
        (secondReferrerDoc.data().bonus || 0) + (depositedAmount * 3) / 100,
      classTwoBonus:
        (secondReferrerDoc.data().classTwoBonus || 0) +
        (depositedAmount * 3) / 100,
    });
  }

  if (thirdReferrer) {
    await updateDoc(thirdReferrerDocRef, {
      bonus: (thirdReferrerDoc.data().bonus || 0) + (depositedAmount * 1) / 100,
      classThreeBonus:
        (thirdReferrerDoc.data().classThreeBonus || 0) +
        (depositedAmount * 1) / 100,
    });
  }
};

export default awardReferrer;
