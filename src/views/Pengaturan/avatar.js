import { useState, useCallback } from 'react';
import { Avatar, CircularProgress, Typography } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import { setDoc, doc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { useSnackbar } from 'notistack';

import useStyle from './styles/avatar';
import storage from '../../configs/firebase/storage';
import { useData } from '../../contexts/DataProvider';
import { useFirebase } from '../../contexts/FirebaseProvider';
import { db } from '../../configs/firebase/firestore';


function UploadAvatar() {
  const classes = useStyle();
  const { profile } = useData();
  const { user } = useFirebase();
  const { enqueueSnackbar } = useSnackbar();
  const [accept] = useState(['image/png', 'image/jpeg', 'image/jpg']);
  const [maxSize] = useState('20971520');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onDropAccepted = useCallback((accFile) => {
    setError('');

    const file = accFile[0];
    const reader = new FileReader();

    reader.onabort = () => {
      setError('Pembacaan file dibatalkan');
    }

    reader.onerror = () => {
      setError('Pembacaan file gagal/error');
    }

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = async () => {
        setLoading(true);

        try {
          const canvas = document.createElement('canvas');
          const width = 250;
          const ratio = img.width / img.height;
          const height = width / ratio;

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const resizedDataURLWebP = ctx.canvas.toDataURL('image/webp', 0.75);
          const fotoRef = ref(storage, `profiles/${user.uid}/images/avatar.webp`);
          const fotoSnapshot = await uploadString(fotoRef, resizedDataURLWebP, 'data_url');
          const fotoUrl = await getDownloadURL(fotoSnapshot.ref);

          await setDoc(doc(db, 'profiles', user.uid), {
            foto: fotoUrl
          }, { merge: true });

          enqueueSnackbar("Avatar berhasil diperbaharui!", {
            variant: 'success'
          });

        } catch (e) {
          console.log(e.message);
        }

        setLoading(false);
      }
    }

    reader.readAsDataURL(file);

  }, [user.uid, enqueueSnackbar]);

  const onDropRejected = useCallback((rejected) => {
    if (!accept.includes(rejected[0].type)) {
      setError(`Tipe file tidak didukung :  ${rejected[0].type}`);
    } else if (rejected[0].size >= maxSize) {
      setError('Ukuran file terlalu besar > 20Mb');
    }
  }, [accept, maxSize]);

  const { getInputProps, getRootProps } = useDropzone({
    accept,
    maxSize,
    onDropAccepted,
    onDropRejected,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={classes.avatarWrap}
    >
      <input {...getInputProps()} />
      <Avatar
        alt={profile.nama}
        src={profile.foto}
        className={classes.avatar}
      />
      {
        loading && <CircularProgress
          size={30}
        />
      }
      <Typography variant='caption' color='error'>
        {error}
      </Typography>
    </div>
  )
}

export default UploadAvatar;
