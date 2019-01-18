/**
 * @author arodic / https://github.com/arodic
 *
 * Minimal implementation of io mixin: https://github.com/arodic/io
 * Includes event listener/dispatcher and defineProperties() method.
 * Changed properties trigger "[prop]-changed" event, and execution of changed() and [prop]Changed() functions.
 */
 
export {IoLite, IoLiteMixin} from "./lite/lite.js";
