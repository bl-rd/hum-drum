todo
====

## User journey

- Create an instance of sounder
  - give it a `bpm`
  - give it a time signature (!)
- Add a track
  - this will be a list of notes
- Add another track
  - this will be added to the play list
- Run the thing with a `play()` command

## example usage

```javascript
// will it need to take a time signature?
let track = new HumDrum(bpm);
/**
 * will take 4 args
 * @param {String} key - the name that the track will be referenced by
 * @param {Object|Array} data - the track data.
 * @param {Number} start - the loop number to start on
 * @param {Boolean} loop - whether or not to loop the track
 */
track.addDrums('drums', drumTrackObject, 0, true);
track.addSynth('bass', bassNotesArray, 0, true);
track.addSynth('mid', midNotesArray, 0 true);
track.addSynth('high', highNotesArray, 4, false);
track.play();
track.stop();

// add effects?

```