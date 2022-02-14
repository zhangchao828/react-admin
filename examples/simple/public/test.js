class WhiteNoiseProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    this.volume = 0
    this.timer = null
  }
  process(inputs) {
    const input = inputs[0]
    if (input.length > 0) {
      const samples = input[0]
      let sum = 0
      for (let i = 0; i < samples.length; ++i) {
        sum += samples[i] * samples[i]
      }
      const rms = Math.sqrt(sum / samples.length)
      this.volume = Math.max(rms, this.volume * 0.8)
      this.port.postMessage({ volume: this.volume })
    }
    return true
  }
}
registerProcessor('device', WhiteNoiseProcessor)