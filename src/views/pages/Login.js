import React, { useState } from 'react';
import { Link, Redirect } from "react-router-dom";
import { Container, Paper, Grid, Button, TextField, Typography } from '@material-ui/core';
import { isEmail } from 'validator';

import useStyle from './styles/Login_style';
import logo from '../../images/logo.png';
import { useFirebase } from '../../contexts/FirebaseProvider';
import { logInUser } from '../../configs/firebase/auth';


function Login() {
  const classess = useStyle();
  const [form, setForm] = useState({ email: '', password: '' });
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

    if (!form.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!isEmail(form.email)) {
      newErrors.email = 'Email tidak valid';
    }

    if (!form.password) {
      newErrors.password = 'Password wajib diisi';
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
        const { email, password } = form;
        await logInUser(email, password);

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

  if (user) {
    return <Redirect to="/chat" />
  }

  return (
    <div className={classess.loginBlock}>
      <div className={classess.loginBox}>
        <div className={classess.logoBox}>
          <img src={logo} alt="logo" />
        </div>
        <Container maxWidth="xs">
          <Paper className={classess.paper}>
            <Typography variant="h5" component="h1" className={classess.title}>
              Login
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
              <Grid container className={classess.button}>
                <Grid item xs>
                  <Button type="submit" color="primary" variant='contained' size="large">
                    Login
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant='contained' size="large" component={Link} to="/registrasi">
                    Daftar
                  </Button>
                </Grid>
              </Grid>
            </form>
            <Link to="/lupa-password">Lupa Password?</Link>
          </Paper>
        </Container>
      </div>
    </div>
  );
}

export default Login;
