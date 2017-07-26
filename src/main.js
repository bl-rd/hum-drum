import Sounder from './sounder';

let s = new Tapage(120);
const over = ['', 'd', '', 'd', '', 'g', '', 'g'];
const under = ['d', 'd', 'd', 'd', 'g', 'g', 'g', 'g']
s
    .addTrack(over)
    .addTrack(under)
    .play();