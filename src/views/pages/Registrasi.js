import React, { useState } from 'react';
import { Redirect, Link } from "react-router-dom";
import { Container, Paper, Grid, Button, TextField, Typography } from '@material-ui/core';
import { isEmail } from 'validator';
import { setDoc, doc } from "firebase/firestore";

import useStyle from './styles/Registrasi_style';
import logo from '../../images/logo.png';
import { useFirebase } from '../../contexts/FirebaseProvider';
import { signUpNewUser } from '../../configs/firebase/auth';
import { db } from '../../configs/firebase/firestore';

function Registrasi() {
  const classess = useStyle();
  const [form, setForm] = useState({ nama: '', email: '', password: '', ulangi_password: '', });
  const [error, setError] = useState({});
  const [isSubmitting, setSubmitting] = useState(false);
  const { user } = useFirebase()


  // Saat input diisi
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  // lakukan validasi pada isi inputan
  const validate = () => {
    let newErrors = {};

    if (!form.nama) {
      newErrors.nama = 'Nama wajib diisi'
    }

    if (!form.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!isEmail(form.email)) {
      newErrors.email = 'Email tidak valid';
    }

    if (!form.password) {
      newErrors.password = 'Password wajib diisi';
    }

    if (!form.ulangi_password) {
      newErrors.ulangi_password = 'Ulangi password wajib diisi';
    } else if (form.password !== form.ulangi_password) {
      newErrors.ulangi_password = 'Password tidak sama';
    }

    return newErrors;
  }

  // Saat form disubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const findErrors = validate();

    if (Object.values(findErrors).some((message) => message !== '')) {
      setError(findErrors);

    } else {
      setSubmitting(true);

      try {
        // Pendaftarn email dan password
        const { email, password } = form;
        const user = await signUpNewUser(email, password);

        // Menyimpan informasi pengguna
        const docRef = doc(db, 'profiles', user.uid)
        const payload = { nama: form.nama, createdAt: new Date().toLocaleDateString() }
        await setDoc(docRef, payload);

      } catch (e) {
        let newError = {};
        console.log('catch: ', e);

        switch (e.code) {
          case 'auth/email-already-in-use':
            newError.email = 'Email sudah terdaftar';
            break;
          case 'auth/invalid-email':
            newError.email = 'Email tidak valid';
            break;
          case 'auth/weak-password':
            newError.password = 'Password lemah';
            break;
          case 'auth/operation-not-allowed':
            newError.email = 'Metode Email dan Password tidak didukung';
            break;
          default:
            newError.email = 'Terjadi kesalahan, silahkan coba lagi.';
            break;
        }

        setError(newError);
      }

      setSubmitting(false);
    }
  }

  if (user) {
    return <Redirect to="/chat" />
  }

  return (
    <div className={classess.daftarBlock}>
      <div className={classess.daftarBox}>
        <div className={classess.logoBox}>
          <img src={logo} alt="logo" />
        </div>
        <Container maxWidth="xs">
          <Paper className={classess.paper}>
            <Typography variant="h5" component="h1" className={classess.title}>
              Buat Akun Baru
            </Typography>
            <form onSubmit={handleSubmit} noValidate>
              <TextField
                id="nama"
                type="text"
                name="nama"
                label="Nama"
                margin="normal"
                fullWidth
                required
                variant="outlined"
                value={form.nama}
                onChange={handleChange}
                error={error.nama ? true : false}
                helperText={error.nama}
                disabled={isSubmitting}
              />
              <TextField
                id="email"
                type="email"
                name="email"
                label="Email"
                margin="normal"
                fullWidth
                required
                variant="outlined"
                value={form.email}
                onChange={handleChange}
                error={error.email ? true : false}
                helperText={error.email}
                disabled={isSubmitting}
              />
              <TextField
                id="password"
                type="password"
                name="password"
                label="Password"
                autoComplete="new-password"
                margin="normal"
                fullWidth
                required
                variant="outlined"
                value={form.password}
                onChange={handleChange}
                error={error.password ? true : false}
                helperText={error.password}
                disabled={isSubmitting}
              />
              <TextField
                id="ulangi_password"
                type="password"
                name="ulangi_password"
                label="Ulangi password"
                autoComplete="new-password"
                margin="normal"
                fullWidth
                required
                variant="outlined"
                value={form.ulangi_password}
                onChange={handleChange}
                error={error.ulangi_password ? true : false}
                helperText={error.ulangi_password}
                disabled={isSubmitting}
              />
              <Grid container className={classess.button}>
                <Grid item xs>
                  <Button
                    type="submit"
                    color="primary"
                    variant='contained'
                    size="large"
                    disabled={isSubmitting}
                  >
                    Daftar
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant='contained'
                    size="large"
                    disabled={isSubmitting}
                    component={Link}
                    to="/login"
                  >
                    Login
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </div>
    </div>
  );
}

export default Registrasi;
