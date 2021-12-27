// Export all React components inside a component folder
import * as Components from './components';
declare var global: any;

// Export it as a module name to not be overridden by other modules
global.NumberGuessingGame = Components;