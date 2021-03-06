###
## SoundSystem tries to abstract away different ways of playing sound,
## according to weird performance characteristics of each browser
## (and probably, OS). Cross-browser sound playing is really in a sorry
## state, we are trying to make do here.
###

class SoundSystem

  constructor: (
    @timeKeeper,
    @audioApi,
    @samplebank,
    @patternPlayer
  ) ->
    @timeKeeper.addListener('beat', (beat) => @playSounds(beat) )
    @playPatterns = []

  addToScope: (scope) ->
    scope.addFunction('play', (soundName, pattern) => @play(soundName, pattern))
    scope.addFunction('getFFT', () => @getFFT())
    scope.addFunction('getWaveForm', () => @getWaveForm())
    scope.addFunction('setSmoothingTimeConstant', (value) => @setSmoothingTimeConstant(value))
    scope.addFunction('setNumVars', (value) => @setNumVars(value))
    scope.addFunction('getFFTvalue', (value) => @getFFT()[0][value])#TODO this not working

  clearPatterns: ->
    @playPatterns = []

  playStartupSound: ->
    @audioApi.play('bing')

  # called from within patches
  play: (name, pattern) ->
    if (name && pattern)
      @playPatterns.push({
        name: name,
        pattern: pattern
      })


  getFFT: () ->
    @audioApi.getFFT()

  getWaveForm: (value) ->
    @audioApi.getWaveForm()

  setSmoothingTimeConstant: (value) ->
    @audioApi.setSmoothingTimeConstant value

  setNumVars: (value) ->
    @audioApi.setNumVars value

  playSounds: (beat) =>
    for p in @playPatterns
      if (@patternPlayer.runPattern(p.pattern, beat))
        @audioApi.play(p.name)
    @clearPatterns()

module.exports = SoundSystem
