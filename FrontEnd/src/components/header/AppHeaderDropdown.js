import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCommentSquare,
  cilFile,
  cilEnvelopeClosed,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilEnvelopeOpen,
  cilUser,
  cilAccountLogout,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'
import userImage from './../../assets/images/avatars/userImage.jpg'
import desImgae from './../../assets/images/avatars/user (2).png'
const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  // const data = localStorage.getItem('userLogged')
  // const ParsedData = JSON.parse(data)
  // let firstName = ParsedData.firstName
  // let lastName = ParsedData.lastName
  // let email = ParsedData.email
  // let userDesignation = ParsedData.designation_id

  useEffect(() => {
    const data = localStorage.getItem('userLogged')
    if (data) {
      const parsedData = JSON.parse(data)
      const userDesignation = parsedData.designation_id
    }
  }, [])

  let firstName
  let lastName
  let email
  let userDesignation

  const logOut = () => {
    localStorage.removeItem('userLogged')
    // navigate('/#/login')
    window.location.href = window.location.origin + '/#/login'
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={userImage} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">User Details</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          {firstName + ' ' + lastName}
        </CDropdownItem>
        <CDropdownItem href="#">
          <img style={{ height: '20px' }} src={desImgae} className="me-2" />
          {(() => {
            switch (userDesignation) {
              case 1:
                return 'CEO'
              case 2:
                return 'Tester'
              case 3:
                return 'Software Developer'
              default:
                return ''
            }
          })()}
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeClosed} className="me-2" />
          {email}
        </CDropdownItem>

        {/* <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Updates
          <CBadge color="info" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilTask} className="me-2" />
          Tasks
          <CBadge color="danger" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCommentSquare} className="me-2" />
          Comments
          <CBadge color="warning" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownHeader className="bg-light fw-semibold py-2">Settings</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem> */}

        {/* <CDropdownItem onClick={logOut} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          LogOut
        </CDropdownItem> */}

        <CDropdownDivider />
        <CDropdownItem onClick={logOut} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          LogOut
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
