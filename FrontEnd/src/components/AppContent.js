import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import axios from 'axios'
import routes from '../routes'
import { USER_API_ENDPOINT } from 'src/constants'
import Dashboard from 'src/views/dashboard/Dashboard'

const AppContent = () => {
  const [moduleNames, setModuleNames] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  let userDesignation = 1
  // const localData = localStorage.getItem('userLogged')
  // const ParsedData = JSON.parse(localData)
  // const userDesignation = ParsedData.designation_id

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${USER_API_ENDPOINT}getUserAccessByID/${userDesignation}`)
        const data = response.data.data
        const moduleNames = data.map((item) => item.userAccessRights.Module_Name)
        setModuleNames(moduleNames)
      } catch (error) {
        console.error('Error fetching user access rights:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, []) // Empty dependency array to fetch data only once

  // Filter routes based on moduleNames
  const filteredRoutes = routes.filter((route) => moduleNames.includes(route.name))

  // Check if the current path should be redirected
  const shouldRedirect =
    location.pathname.includes('toolCustomisation') &&
    !filteredRoutes.some((route) => route.path === location.pathname)

  if (loading) {
    return <CSpinner color="primary" />
  }

  if (shouldRedirect) {
    return <Navigate to="/" replace />
  }

  return (
    <CContainer lg>
      <Routes>
        {filteredRoutes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={<route.element />} // Render the route element directly
          />
        ))}
        {/* Catch-all route */}
        <Route path="*" element={<Dashboard />} /> {/* Render Dashboard for any unmatched route */}
      </Routes>
    </CContainer>
  )
}

export default React.memo(AppContent)
