import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import {footer, main, header} from './common'
import {navigation} from './navigation/navigation';

const body = $(document.body);

body.append(navigation(),header(),main(),footer());
//                                  
