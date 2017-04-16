/**
 * Created by cool.blue on 15/04/2017.
 */
import HistWorker from 'worker!./histogramWorker.js'
import Dispatch from 'd3-dispatch'
export let dispatch = Dispatch('dataReady');



const routes = {
    histogramReady: function(o) {

    }
};
