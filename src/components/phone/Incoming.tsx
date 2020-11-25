import * as React from 'react'
import { Invitation, SessionState } from 'sip.js'
import { connect } from 'react-redux'
import styles from './Phone.scss'
import { acceptCall, declineCall } from '../../actions/sipSessions'
import toneManager from '../../util/ToneManager'
import { GetStyleSize } from '../../util/getstyle'

const acceptIcon = require('./assets/call-24px.svg')
const declineIcon = require('./assets/call_end-24px.svg')
const ring = require('./assets/ring.mp3')

interface Props {
  session: Invitation
  autoanswer: boolean
  acceptCall: Function
  declineCall: Function
  appSize: string
}

class Incoming extends React.Component<Props> {
  private timer: any

  componentDidMount() {
    toneManager.stopAll()
    toneManager.playRing('ringtone')
    console.log(`auto-answer is: ${this.props.autoanswer}`)
    if (this.props.autoanswer) {
      this.timer = setInterval(() => {
        this.handleAutoAnswer()
      }, 1000)
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  handleAccept() {
    toneManager.stopAll()
    if (this.props.session.state === SessionState.Initial) {
      this.props.session.accept({
        sessionDescriptionHandlerOptions: {
          constraints: {
            audio: true,
            video: false
          }
        }
      })
    }
    this.props.acceptCall(this.props.session)
  }

  handleAutoAnswer() {
    console.log('\n\n\n ************ handleAutoAnswer ********** \n\n\n')
    if (this.props.session.state === SessionState.Initial) {
      this.handleAccept()
    }
    clearInterval(this.timer)
  }

  handleDecline() {
    toneManager.stopAll()
    if (
      this.props.session.state !== SessionState.Terminated &&
      this.props.session.state !== SessionState.Terminating
    ) {
      this.props.session.reject()
    }
    this.props.declineCall(this.props.session)
  }

  render() {
    const props = this.props
    const styleEndCallButton = GetStyleSize(props.appSize, 'endCallButton', styles)
    const styleStartCallButton = GetStyleSize(props.appSize, 'startCallButton', styles)
    const styleIncoming = GetStyleSize(props.appSize, 'incoming', styles)
    return (
      <div id={styleIncoming}>
        {
          // @ts-ignore
          `Incoming: ${props.session.remoteIdentity.uri.normal.user} - ${props.session.remoteIdentity._displayName}`
        }
        <div
          className={styleEndCallButton}
          onClick={() => this.handleDecline()}
        >
          <img src={declineIcon} />
        </div>
        <div
          className={styleStartCallButton}
          onClick={() => this.handleAccept()}
        >
          <img src={acceptIcon} />
        </div>
        <audio id='ringtone' loop>
          <source src={ring} type='audio/mpeg' />
        </audio>
        <audio id={this.props.session.id} />
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  stateChanged: state.sipSessions.stateChanged,
  appSize: state.config.appConfig.appSize
})
const actions = {
  acceptCall,
  declineCall
}
export default connect(mapStateToProps, actions)(Incoming)
