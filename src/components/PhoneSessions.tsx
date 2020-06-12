import * as React from 'react'
import { connect } from 'react-redux'
import Phone from './phone/Phone'
import Incoming from './phone/Incoming'
import { PhoneConfig } from '../models'

const getSessions = (sessions: any, phoneConfig: PhoneConfig, attendedTransfers: Array<string>) => {
  const elements = []
  for (const session in sessions) {
    if (attendedTransfers.includes(session)) continue
    elements.push(
      <Phone session={sessions[session]} key={session} phoneConfig={phoneConfig} />
    )
  }
  return elements
}

const getIncomingCallReferrals = (sessions: any) => {
  const elements = []
  for (const session in sessions) {
    elements.push(<Incoming session={sessions[session]} key={session} />)
  }
  return elements
}

interface Props {
  sessions: any
  incomingCalls: any
  phoneConfig: PhoneConfig
  attendedTransfers: Array<string>
}

class PhoneSessions extends React.Component<Props> {
  render() {
    return <React.Fragment>
      {/* {<Phone 
        // @ts-ignore
        session={{}} key={0} />} */}
      {getIncomingCallReferrals(this.props.incomingCalls)}
      {getSessions(this.props.sessions, this.props.phoneConfig, this.props.attendedTransfers)}
    </React.Fragment>
  }
}
const mapStateToProps = (state: any) => ({
  sessions: state.sipSessions.sessions,
  incomingCalls: state.sipSessions.incomingCalls,
  attendedTransfers: state.sipSessions.attendedTransfers
})
const PS = connect(mapStateToProps)(PhoneSessions)
export default PS