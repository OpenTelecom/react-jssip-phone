import { phoneStore } from '../index'
import { Session } from 'sip.js'

import {
  REMOTE_AUDIO_CONNECTED,
  LOCAL_AUDIO_CONNECTED
} from '../actions/device'

//adds track from getReceiver stream to <audio id={sessionId}> in Phone.tsx
export const setRemoteAudio = (session: Session) => {
  const state = phoneStore.getState()
  //@ts-ignore
  const deviceId = state.device.primaryAudioOutput
  const mediaElement = document.getElementById(session.id)
  const remoteStream = new MediaStream()
  //@ts-ignore
  session.sessionDescriptionHandler.peerConnection
    .getReceivers()
    .forEach((receiver: any) => {
      if (receiver.track) {
        remoteStream.addTrack(receiver.track)
      }
    })
  if (mediaElement) {
    // @ts-ignore
    mediaElement.setSinkId(
      // audio output device_id
      deviceId
    )
      .then(() => {
        // @ts-ignore
        mediaElement.srcObject = remoteStream
        //@ts-ignore
        mediaElement.play()
      })
  } else {
    console.log('no media Element')
  }
  phoneStore.dispatch({
    type: REMOTE_AUDIO_CONNECTED
  })
}

//creates new audio track then replaces audio track in getSender stream w/ new track
export const setLocalAudio = (session: Session) => {
  const state = phoneStore.getState()
  //@ts-ignore
  const deviceId = state.device.primaryAudioInput
  // @ts-ignore
  session.sessionDescriptionHandler.peerConnection
    .getSenders()
    .forEach(function (sender: any) {
      console.log(sender)

      if (sender.track && sender.track.kind === 'audio') {
        let audioDeviceId =
          // audio input device_id
          // 'default'
          deviceId
        navigator.mediaDevices
          // @ts-ignore

          //creates a stream w track
          .getUserMedia({ audio: { deviceId: audioDeviceId } })
          .then(function (stream) {
            let audioTrack = stream.getAudioTracks()
            sender.replaceTrack(audioTrack[0])
          })
      }
    })
  phoneStore.dispatch({
    type: LOCAL_AUDIO_CONNECTED
  })
}

export const cleanupMedia = (sessionId: string) => {
  const mediaElement = document.getElementById(sessionId)
  if (mediaElement) {
    // @ts-ignore
    mediaElement.srcObject = null
    // @ts-ignore
    mediaElement.pause()
  }
}
