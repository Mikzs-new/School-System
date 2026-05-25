import { useState } from 'react'

import { MODULES } from '../state/permissions.js'

import ModuleView from './ModuleView.jsx'

import ElectionDetail from './ElectionDetail.jsx'

export default function Elections({
  user
}) {

  const [
    selectedElection,
    setSelectedElection
  ] = useState(null)

  if (selectedElection) {

    return (
      <ElectionDetail
        election={selectedElection}
        onBack={() =>
          setSelectedElection(null)
        }
      />
    )
  }

  return (

    <ModuleView
      moduleConfig={MODULES.elections}
      user={user}
      onRowClick={(election) =>
        setSelectedElection(election)
      }
    />

  )
}