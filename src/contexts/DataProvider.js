import { useContext, createContext } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { useFirebase } from "./FirebaseProvider";
import { AppLoading } from "../components";
import { getContact, getChat } from '../configs/firebase/firestore';


const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

function DataProvider({ children }) {
  const { user } = useFirebase();
  const contactsCol = getContact();
  const chatCol = getChat(user.uid);

  const [contacts, loadingContacts] = useCollectionData(contactsCol, { idField: "id" });
  const [chats, loadingChats] = useCollectionData(chatCol, { idField: "id" });

  const profile = contacts && contacts.find((contact) => contact.id === user.uid);

  if (loadingContacts || loadingChats) {
    return <AppLoading />;
  }

  return (
    <DataContext.Provider
      value={{
        contacts,
        chats,
        profile
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataProvider;
