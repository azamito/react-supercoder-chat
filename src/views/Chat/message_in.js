import { useEffect, Fragment } from 'react';
import { Typography } from '@material-ui/core';
import { doc, setDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

import { db } from '../../configs/firebase/firestore';
import { useFirebase } from '../../contexts/FirebaseProvider';
import { unixToTime } from '../../utils/datetime';


function MessageIn({ message }) {
  const params = useParams();
  const { user } = useFirebase();

  useEffect(() => {
    if (!message.is_read) {
      const readChat = async () => {
        try {
          const messageRef = doc(db, `/chats/${params.chatId}/messages/${message.id}`);
          await setDoc(messageRef, {
            is_read: true
          }, { merge: true });

          const chatRef = doc(db, `chats/${params.chatId}`)
          await setDoc(chatRef, {
            unread_count: {
              [user.uid]: 0
            }
          }, { merge: true });
        } catch (e) {
          console.log(e.message);
        }
      };

      readChat();
    }
  }, [message.is_read, message.id, params.chatId, user.uid]);

  return (
    <Fragment>
      {message.text.split("\n").map((text, i) => (
        <Typography color="primary" key={i}>{text}</Typography>
      ))}
      <Typography variant="caption">
        {unixToTime(message.created_at && message.created_at.toMillis())}
      </Typography>
      <hr />
    </Fragment>
  )
}

export default MessageIn
