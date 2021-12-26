import { useState } from 'react';
import { useSnackbar } from 'notistack';
import isEmail from 'validator/lib/isEmail';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress
} from '@material-ui/core';

import { useData } from '../../contexts/DataProvider';
import { useFirebase } from '../../contexts/FirebaseProvider';
import { db } from '../../configs/firebase/firestore';
import { updateEmail, updatePassword } from 'firebase/auth';
import { auth } from '../../configs/firebase/auth';


function EditDialog({ open, handleClose, fieldMode }) {
  const { user } = useFirebase();
  const { profile } = useData();
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    nama: profile.nama,
    deskripsi: profile.deskripsi || '',
    email: user.email,
    password: ""
  });

  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError({
      ...error,
      [e.target.name]: ''
    });
  }

  const updateProfile = async () => {
    const fieldName = fieldMode.toLowerCase();

    if (!form[fieldName]) {
      return setError({
        [fieldName]: `${fieldMode} wajib diisi`
      })
    }

    setIsSubmitting(true);
    try {
      await setDoc(doc(db, 'profiles', user.uid), {
        [fieldName]: form[fieldName],
        updated_at: serverTimestamp()
      }, { merge: true });

      enqueueSnackbar(`${fieldMode} berhasil diperbaharui`, {
        variant: 'success'
      })

      handleClose();

    } catch (e) {
      setError({
        [fieldName]: e.message
      })
    }
    setIsSubmitting(false);
  }

  const setEmail = async (e) => {
    const { email } = form;

    if (!email) {
      setError({
        email: 'Email wajib diisi'
      })
    } else if (!isEmail(email)) {
      setError({
        email: 'Email tidak valid'
      })
    } else if (email !== user.email) {
      setError({
        email: ''
      })

      setIsSubmitting(true);

      try {
        await updateEmail(auth.currentUser, email)

        enqueueSnackbar('Email berhasil diperbaharui', {
          variant: 'success'
        });

        handleClose();

      } catch (e) {
        let emailError = '';

        switch (e.code) {
          case 'auth/email-already-in-use':
            emailError = 'Email sudah digunakan oleh pengguna lain';
            break;
          case 'auth/invalid-email':
            emailError = 'Email tidak email';
            break;
          case 'auth/requires-recent-login':
            emailError = 'Silahkan logout, kemudian login kembali untuk memperbaiki email';
            break;
          default:
            emailError = 'Terjadi kesalahan silahkan coba lagi'
            break;
        }

        setError({
          email: emailError
        });

      }

      setIsSubmitting(false);
    }
  }

  const setPassword = async (e) => {
    const { password } = form;

    if (!password) {
      setError({
        password: 'Password wajib diisi'
      })

    } else if (password.length < 6) {
      setError({
        password: 'Password minimal 6 karakter'
      })

    } else {
      setIsSubmitting(true);

      try {
        await updatePassword(auth.currentUser, password);

        enqueueSnackbar('Password berhasil diperbaharui', {
          variant: 'success'
        })

        handleClose();

      } catch (e) {
        console.log(error);
        let errorPassword = '';

        switch (e.code) {
          case 'auth/weak-password':
            errorPassword = 'Password terlalu lemah'
            break;
          case 'auth/requires-recent-login':
            errorPassword = 'Silahkan logout, kemudian login kembali intuk merubah password'
            break;
          default:
            errorPassword = 'Terjadi kesalahan silahkan ulangi lagi'
            break;
        }

        setError({
          password: errorPassword
        });

      }

      setIsSubmitting(false);
    }
  }

  const handleSimpan = async (e) => {
    switch (fieldMode) {
      case 'Email':
        await setEmail();
        break;
      case 'Password':
        await setPassword();
        break;
      default:
        await updateProfile();
        break;
    }
  }

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      disableBackdropClick
      disableEscapeKeyDown
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id='form-dialog-title'>Ubah {fieldMode}</DialogTitle>

      <DialogContent>
        {isSubmitting && <LinearProgress />}
        {
          fieldMode === "Nama" && <TextField
            id='nama'
            name='nama'
            label='Nama'
            fullWidth
            margin='dense'
            autoFocus
            value={form.nama}
            onChange={handleChange}
            error={error.nama ? true : false}
            helperText={error.nama}
            disabled={isSubmitting}
          />
        }
        {
          fieldMode === "Deskripsi" && <TextField
            id='deskripsi'
            name='deskripsi'
            label='Deskripsi'
            fullWidth
            value={form.deskripsi}
            onChange={handleChange}
            error={error.deskripsi ? true : false}
            helperText={error.deskripsi}
            disabled={isSubmitting}
          />
        }
        {
          fieldMode === "Email" && <TextField
            id='email'
            name='email'
            label='Email'
            fullWidth
            value={form.email}
            onChange={handleChange}
            error={error.email ? true : false}
            helperText={error.email}
            disabled={isSubmitting}
          />
        }
        {
          fieldMode === "Password" && <TextField
            id='password'
            name='password'
            label='Password'
            fullWidth
            value={form.password}
            onChange={handleChange}
            error={error.password ? true : false}
            helperText={error.password}
            disabled={isSubmitting}
          />
        }
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color='secondary' disabled={isSubmitting}>Batal</Button>
        <Button onClick={handleSimpan} color='primary' disabled={isSubmitting}>Simpan</Button>
      </DialogActions>
    </Dialog>
  )

}

export default EditDialog;
