import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Paper, Grid, Button, TextField, Typography } from '@material-ui/core';
import { isEmail } from 'validator';
import { useSnackbar } from 'notistack';

import useStyle from './styles/LupaPassword_style';
import logo from '../../images/logo.png';
import { resetPassword } from '../../configs/firebase/auth';


function LupaPassword(props) {
  const classess = useStyle();

  const [form, setForm] = useState({ email: '' });
  const [error, setError] = useState({});
  const [isSubmitting, setSubmitting] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

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

    if (!form.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!isEmail(form.email)) {
      newErrors.email = 'Email tidak valid';
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
        const { email } = form;
        const actionCodeSettings = {
          url: `${window.location.origin}/login`,
          handleCodeInApp: true
        };
        await resetPassword(email, actionCodeSettings);

        enqueueSnackbar(`Cek kotak masuk ${form.email}, sebuah tautan dikirim untuk reset password anda`, {
          variant: "success"
        })

      } catch (e) {
        let newError = {};

        switch (e.code) {
          case 'auth/user-not-found':
            newError.email = 'Email tidak terdaftar';
            break;
          case 'auth/invalid-email':
            newError.email = 'Email tidak valid';
            break;
          case 'auth/wrong-password':
            newError.password = 'Password salah';
            break;
          case 'auth/user-disabled':
            newError.email = 'Pengguna diblokir';
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

  return (
    <div className={classess.lupaPasswordBlock}>
      <div className={classess.lupaPasswordBox}>
        <div className={classess.logoBox}>
          <img src={logo} alt="logo" />
        </div>
        <Container maxWidth="xs">
          <Paper className={classess.paper}>
            <Typography variant="h5" component="h1" className={classess.title}>
              Lupa Password
            </Typography>
            <form onSubmit={handleSubmit} noValidate>
              <TextField
                id="email"
                type="email"
                name="email"
                label="Alamat email"
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
              <Grid container className={classess.button}>
                <Grid item xs>
                  <Button type="submit" color="primary" variant='contained' size="large">
                    Kirim
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant='contained' size="large" component={Link} to="/login">
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

export default LupaPassword;

