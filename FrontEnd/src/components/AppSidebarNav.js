import React, { useEffect, useState, useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CBadge } from '@coreui/react'
import axios from 'axios'
import { USER_API_ENDPOINT } from 'src/constants'

export const AppSidebarNav = ({ items }) => {
  const [filteredItems, setFilteredItems] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  let userDesignation

  useEffect(() => {
    // const data = localStorage.getItem('userLogged')
    // const ParsedData = JSON.parse(data)
    // let userDesignation = ParsedData.designation_id

    // Modify item names if userDesignation is 2
    let modifiedItems = items.map((item) => {
      if (userDesignation === 2 && item.name === 'Assigned Activities') {
        return { ...item, name: 'Activities For Testing' }
      }
      return item
    })
    console.log('Modified Items:', modifiedItems) // Log modified items

    const fetchData = async () => {
      try {
        const response = await axios.get(`${USER_API_ENDPOINT}getUserAccessByID/${userDesignation}`)
        console.log('API Response:', response.data.data)

        let moduleNames = response.data.data.map((access) => access.userAccessRights.Module_Name)

        if (userDesignation === 2) {
          moduleNames = moduleNames.map((name) =>
            name === 'Assigned Activities' ? 'Activities For Testing' : name,
          )
        }

        console.log('Module Names:', moduleNames)

        const newFilteredItems = modifiedItems.filter((item) => moduleNames.includes(item.name))
        console.log('Filtered Items:', newFilteredItems)

        setFilteredItems(newFilteredItems)
      } catch (error) {
        console.error('Error fetching user access data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [items])

  const navLink = (name, icon, badge) => {
    return (
      <>
        {icon && icon}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = useMemo(
    // eslint-disable-next-line react/display-name
    () => (item, index) => {
      const { component: Component, name, badge, icon, ...rest } = item
      if (!Component) return null
      return (
        <Component
          {...(rest.to &&
            !rest.items && {
              component: NavLink,
            })}
          key={index}
          {...rest}
        >
          {navLink(name, icon, badge)}
        </Component>
      )
    },
    [],
  )

  const navGroup = useMemo(
    // eslint-disable-next-line react/display-name
    () => (item, index) => {
      const { component: Component, name, icon, to, ...rest } = item
      if (!Component) return null
      return (
        <Component
          idx={String(index)}
          key={index}
          toggler={navLink(name, icon)}
          visible={location.pathname.startsWith(to)}
          {...rest}
        >
          {item.items?.map((item, index) =>
            item.items ? navGroup(item, index) : navItem(item, index),
          )}
        </Component>
      )
    },
    [location.pathname],
  )

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <React.Fragment>
      {filteredItems.length > 0 ? (
        filteredItems.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index),
        )
      ) : (
        <p>No items to display</p>
      )}
    </React.Fragment>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
