import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import db from "../../store/server.config";
import { collection, onSnapshot } from "firebase/firestore";
import { Decrypt } from "../../helpers/Cypher";

const useStyles = makeStyles((theme) => ({}));

const UsersDetails = () => {
  const classes = useStyles();
  const [data, setData] = useState();

  const getUsers = async () => {
    const colRef = collection(db, "users");

    onSnapshot(colRef, (snapshot) => {
      setData(snapshot.docs.map((doc) => doc.data()));
      console.log(snapshot.docs.map((doc) => doc.data()));
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <div>User Details</div>

      {data &&
        data.map((doc) => (
          <div style={{ textAlign: "left", padding: 20 }}>
            <p>First Name: {doc.firstname}</p>
            <p>Last Name: {doc.lastname}</p>
            <p>Email: {doc.email}</p>
            <p>Phone: {doc.phone_number}</p>
            <p>Password: {Decrypt(doc.password)}</p>
          </div>
        ))}
    </div>
  );
};

export default UsersDetails;
