import { Component } from 'react'
import './style.less'
import cls from 'classnames'
import mp3 from './t1.mp3'
import assets from './assets'

export default class DeviceTest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      speaker: null,
      microphone: null,
      stream: null,
    }
    this.requirePermission = this.requirePermission.bind(this)
    this.getDevice = this.getDevice.bind(this)
    this.handleVisible = this.handleVisible.bind(this)
  }
  requirePermission() {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .then((stream) => {
        this.getDevice(stream)
      })
  }
  getDevice(stream) {
    navigator.mediaDevices.enumerateDevices().then((device) => {
      const speaker = device.find((item) => item.label.indexOf('Speakers') !== -1) || {}
      const microphone = device.find((item) => item.label.indexOf('Microphone') !== -1) || {}
      this.setState({
        speaker: speaker.label || 'speaker',
        microphone: microphone.label || 'microphone',
        visible: true,
        stream,
      })
    })
  }
  handleVisible() {
    const { visible, stream } = this.state
    if (!stream) {
      this.requirePermission()
    } else {
      this.setState({
        visible: !visible,
      })
    }
  }
  render() {
    const { visible, speaker, microphone, stream } = this.state
    return (
      <div className="device-test">
        <Modal visible={visible} onClose={this.handleVisible}>
          <Speaker title={speaker} />
          <Microphone stream={stream} title={microphone} />
        </Modal>
        <div className="test-button" onClick={this.handleVisible}>
          <img src={assets.test} alt="test" />
          <span>Test Speaker and Microphone</span>
        </div>
      </div>
    )
  }
}
class Modal extends Component {
  render() {
    const { visible, children, onClose } = this.props
    return (
      visible && (
        <div className="test-modal">
          <img src={assets.close} className="close" onClick={onClose} />
          <p className="modal-title">Test Speaker and Microphone</p>
          <div>{children}</div>
        </div>
      )
    )
  }
}
class Speaker extends Component {
  render() {
    const { title } = this.props
    return title ? (
      <div className="device speaker">
        <div className="device-title">
          <img src={assets.speaker} alt="speaker" />
          <span>
            Speaker <span>{title}</span>
          </span>
        </div>
        <audio src={mp3} controls loop controlsList="nodownload" />
      </div>
    ) : null
  }
}
class Microphone extends Component {
  constructor(props) {
    super(props)
    this.volumeBar = 24
    this.timer = null
    this.volume = 0
    this.list = new Array(this.volumeBar).fill(0)
    this.state = {
      num: 0,
    }
    this.createAudioContext = this.createAudioContext.bind(this)
    this.setVolume = this.setVolume.bind(this)
  }
  createAudioContext() {
    const { stream } = this.props
    const AudioContext = window.AudioContext || window.webkitAudioContext
    const audioContext = new AudioContext()
    const microphone = audioContext.createMediaStreamSource(stream)
    if (audioContext.audioWorklet && audioContext.audioWorklet.addModule) {
      const source = `
      class WhiteNoiseProcessor extends AudioWorkletProcessor {
        constructor() {
          super()
          this.volume = 0
        }
        process(inputs) {
          const input = inputs[0]
          if (input.length > 0) {
            const samples = input[0]
            let maxVal = 0
            for (let i = 0; i < samples.length; i++) {
              if (maxVal < samples[i]) {
                maxVal = samples[i]
              }
            }
            this.volume = maxVal
            this.port.postMessage({ volume: this.volume })
          }
          return true
        }
      }
      registerProcessor('device', WhiteNoiseProcessor)
      `
      const blob = new Blob([source], { type: 'application/javascript' })
      audioContext.audioWorklet.addModule(URL.createObjectURL(blob)).then(() => {
        const node = new AudioWorkletNode(audioContext, 'device')
        microphone.connect(node).connect(audioContext.destination)
        node.port.onmessage = (event) => {
          this.volume = event.data.volume
        }
        this.disconnect = () => {
          microphone.disconnect(node)
        }
      })
    } else {
      const processor = audioContext.createScriptProcessor(4096, 1, 1)
      microphone.connect(processor)
      processor.connect(audioContext.destination)
      processor.onaudioprocess = (e) => {
        const buffer = e.inputBuffer.getChannelData(0) //获得缓冲区的输入音频，转换为包含了PCM通道数据的32位浮点数组
        //创建变量并迭代来获取最大的音量值
        let maxVal = 0
        for (let i = 0; i < buffer.length; i++) {
          if (maxVal < buffer[i]) {
            maxVal = buffer[i]
          }
        }
        this.volume = maxVal
      }
      this.disconnect = () => {
        microphone.disconnect(processor)
        processor.onaudioprocess = undefined
      }
    }
  }
  setVolume() {
    this.timer = setInterval(() => {
      const { volume, volumeBar } = this
      if (volume) {
        const num = Math.round(volume * 5 * volumeBar)
        this.setState({ num })
      }
    }, 100)
  }
  componentDidMount() {
    this.createAudioContext()
    this.setVolume()
  }
  componentWillUnmount() {
    clearInterval(this.timer)
    if (this.disconnect) {
      this.disconnect()
    }
  }

  render() {
    const { title } = this.props
    const { num } = this.state
    return title ? (
      <div className="device microphone">
        <div className="device-title">
          <img src={assets.microphone} alt="microphone" />
          <span>
            Microphone <span>{title}</span>
          </span>
        </div>
        <div className="volume">
          {this.list.map((item, index) => {
            return (
              <div key={index} className={cls('volume-item', index < num && 'volume-active')} />
            )
          })}
        </div>
        {/*<p>The microphone is working properly, If input level changes when you speak</p>*/}
      </div>
    ) : null
  }
}
