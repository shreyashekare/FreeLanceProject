/* eslint-disable no-restricted-globals */
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { USER_API_ENDPOINT } from '../../../constants/index'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardGroup,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilLockLocked } from '@coreui/icons'
import axios from 'axios'
import Swal from 'sweetalert2'

// or via CommonJS

const Login = () => {
  const navigate = useNavigate()
  const [email, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    if (email === '' || password === '') {
      setErrorMessage('Both fields are required')
      return
    }

    setErrorMessage('')
    try {
      const response = await axios.post(`${USER_API_ENDPOINT}login`, {
        email,
        password,
      })

      if (response.status === 200) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Login successful',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          // Redirect to the desired page after SweetAlert
          localStorage.setItem('userLogged', JSON.stringify(response.data.employee))
          navigate('/')
        })

        // Redirect to the desired page after login
      } else if (response.status === 400) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: response.data.message, // Use the message from the backend response
          showConfirmButton: false,
          timer: 1500,
        })
      }
    } catch (error) {
      setErrorMessage('Invalid email or password')
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: error.response?.data.message || error.message, // Use the message from the backend response or fallback to error message
        showConfirmButton: false,
        timer: 1500,
      })
      console.error('Login error', error)
    }
  }

  return (
    <div
      className="bg-light d-flex justify-content-center align-items-center"
      style={{ height: '700px' }}
    >
      <CContainer>
        <CRow>
          <CCol md="12">
            <CCardGroup style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CCard className="p-4" style={{ maxWidth: '700px' }}>
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1 style={{ textAlign: 'center' }}>Login</h1>
                    <p className="text-medium-emphasis" style={{ textAlign: 'center' }}>
                      Sign In to your account
                    </p>
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    <CInputGroup style={{ height: '50px' }} className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup style={{ height: '50px' }} className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="12">
                        <CButton
                          type="submit"
                          style={{ height: '50px' }}
                          color="primary"
                          className="w-100"
                        >
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
